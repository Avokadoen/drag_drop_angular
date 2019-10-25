package no.nb.samo.restcontroller;

import no.nb.samo.model.Delivery;
import no.nb.samo.model.StorageObject;
import org.springframework.beans.factory.annotation.Value;
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

    // TODO: unit test
    // TODO: sortBy enum on StorageObject or an upper class
    @GetMapping(path="/getDelivery")
    public Delivery getStorageObject(
            @RequestParam("deliveryId") String deliveryId,
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageSize") int pageSize) throws InterruptedException {

        ArrayList<StorageObject> so = testDeliveries.get(deliveryId);
        if (so == null) {
            so = generateNewTestDelivery(deliveryId);
        }

        Thread.sleep(1500);

        int fromIndex = Math.min(pageNumber * pageSize, so.size());
        int toIndex = Math.min(fromIndex + pageSize, so.size());
        return new Delivery(deliveryId, so.size(), so.subList(fromIndex, toIndex));
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
                    "id til beholder"));
        }
        testDeliveries.put(deliveryId, testDelivery);
        return testDelivery;
    }
}
