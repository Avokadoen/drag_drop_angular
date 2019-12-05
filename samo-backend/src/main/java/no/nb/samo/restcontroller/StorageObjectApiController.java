package no.nb.samo.restcontroller;

import no.nb.samo.model.Delivery;
import no.nb.samo.model.StorageObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@CrossOrigin
@RequestMapping({"/api"})
public class StorageObjectApiController {
    private final Random random = new Random();
    private Map<String, ArrayList<StorageObject>> testDeliveries;

    public StorageObjectApiController() {
        testDeliveries = new HashMap<>();
    }


    @GetMapping(path="/getAllOrganisationIds")
    public String[] getAllOrganisationIds() {
        return new String[] { "Burde", "lastes", "inn", "fra", "f.eks", "brønnøysundregistrene?" };
    }

    @GetMapping(path="/getDelivery")
    public Delivery getStorageObject(
            @RequestParam("deliveryId") String deliveryId,
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageSize") int pageSize) throws InterruptedException {

        ArrayList<StorageObject> so = testDeliveries.get(deliveryId);
        if (so == null) {
            so = generateNewTestDelivery(deliveryId);
        }

        int fromIndex = Math.min(pageNumber * pageSize, so.size());
        int toIndex = Math.min(fromIndex + pageSize, so.size());
        return new Delivery(deliveryId, so.size(), so.subList(fromIndex, toIndex));
    }

    @PostMapping(path="registerObject")
    public String registerObject(@RequestBody StorageObject so) {
        ArrayList<StorageObject> delivery = testDeliveries.get(so.getDeliveryId());
        delivery.add(so);
        return "{\"status\":\"ok\"}";
    }

    // TODO: use index to change object instead of id as objectid can be changed
    @PostMapping(path="updateObject")
    public ResponseEntity<String> updateObject(@RequestBody StorageObject[] storageObject) {

        if (storageObject == null || storageObject.length != 2) {
            return new ResponseEntity<>( "{\"status\":\"invalid_storage_delivery_count\"}", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (!storageObject[0].getDeliveryId().equals(storageObject[1].getDeliveryId())) {
            ArrayList<StorageObject> fromDelivery = testDeliveries.get(storageObject[0].getDeliveryId());
            fromDelivery.remove(storageObject[0]);

            ArrayList<StorageObject> toDelivery = testDeliveries.get(storageObject[1].getDeliveryId());
            toDelivery.add(storageObject[1]);
        } else {
            ArrayList<StorageObject> delivery = testDeliveries.get(storageObject[0].getDeliveryId());
            int index = delivery.indexOf(storageObject[0]);
            try {
                delivery.set(index, storageObject[1]);
            } catch (IndexOutOfBoundsException e){
                return new ResponseEntity<>( "{\"status\":\"invalid_index\"}", HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        return new ResponseEntity<>( "{\"status\":\"ok\"}", HttpStatus.OK);
    }

    private ArrayList<StorageObject> generateNewTestDelivery(String deliveryId) {

        int testObjectCount = random.nextInt(4900) + 100; // 100 <-> 5000

        ArrayList<StorageObject> testDelivery = new ArrayList<>(testObjectCount);
        final String[] organisationIds = getAllOrganisationIds();

        for (int i = 0; i < testObjectCount; i++) {
            String matType = (random.nextFloat() > 0.5 ? "film" : "lyd" );
            String matCond = (random.nextFloat() > 0.5 ? "dårlig" : "god" );
            String contType = (random.nextFloat() > 0.5 ? "behold" : "returner" );

            final int orgIndex = random.nextInt(organisationIds.length);
            testDelivery.add(new StorageObject(
                    deliveryId + i,
                    organisationIds[orgIndex],
                    String.valueOf(orgIndex * 1000),
                    matType,
                    matCond,
                    contType,
                    "sammlingstittel",
                    "mer info om objekt",
                    "id til beholder",
                    deliveryId));
        }

        testDeliveries.put(deliveryId, testDelivery);
        return testDelivery;
    }
}
