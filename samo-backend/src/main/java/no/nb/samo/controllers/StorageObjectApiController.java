package no.nb.samo.controllers;

import no.nb.samo.model.StorageObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
@RequestMapping({"/api"})
public class StorageObjectApiController {

    // TODO: unit test
    @GetMapping(path="/getDelivery")
    public StorageObject[] getStorageObject(
            @RequestParam("deliveryId") String deliveryId,
            @RequestParam("pageNumber") int pageNumber,
            @RequestParam("pageNumber") int pageSize,
            @Value("${Samo.objectCacheSize}") int cacheSize) {
        final StorageObject[] queryResult = new StorageObject[cacheSize];
        final String[] organisationIds = getAllOrganisationIds();
        final Random rnd = new Random();

        for (int i = 0; i < cacheSize; i++) {
            String matType = (rnd.nextFloat() > 0.5 ? "film" : "lyd" );
            String matCond = (rnd.nextFloat() > 0.5 ? "dårlig" : "god" );
            String contType = (rnd.nextFloat() > 0.5 ? "behold" : "returner" );

            final int orgIndex = rnd.nextInt(organisationIds.length);
            queryResult[i] = new StorageObject(
                    deliveryId + (i + pageNumber * pageSize),
                    organisationIds[orgIndex],
                    String.valueOf(orgIndex * 1000),
                    matType,
                    matCond,
                    contType,
                    "sammlingstittel",
                    "mer info om objekt",
                    "id til beholder");
        }
        return queryResult;
    }

    @GetMapping(path="/getAllOrganisationIds")
    public String[] getAllOrganisationIds() {
        return new String[] { "Burde", "lastes", "inn", "fra", "f.eks", "brønnøysundregistrene?" };
    }

    @GetMapping(path="/**")
    public String invalidApiRequest()
    {
        return "invalid api request";
    }
}
