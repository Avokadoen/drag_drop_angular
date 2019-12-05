package no.nb.samo.restcontroller;

import no.nb.samo.model.EntityResponse;
import no.nb.samo.model.EntityType;
import no.nb.samo.model.SamoDisplayEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.MessageFormat;

@RestController
@CrossOrigin
@RequestMapping({"/api/mocktidev"})
public class MocktidevInterfaceController {

    private final String mocktidevUrl;

    public MocktidevInterfaceController(@Value("${samo.optidevApiUrl}") String mocktidevUrl) {
        this.mocktidevUrl = mocktidevUrl;
    }

    @GetMapping(path="/getLocation")
    public ResponseEntity<EntityResponse> getLocation(@RequestParam("locationBarcode") String locationBarcode) throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();
        URI uri = new URI(MessageFormat.format("{0}/get_with_children/{1}", mocktidevUrl, locationBarcode));
        SamoDisplayEntity entity = restTemplate.getForObject(uri, SamoDisplayEntity.class);
        if (entity == null) {
            return getResponseEntity(null, HttpStatus.NOT_FOUND,"failed to retrieve entity with id {0}", locationBarcode);
        }
        if (entity.getEntityType() != EntityType.LOCATION.ordinal()) {
            return getResponseEntity(null, HttpStatus.BAD_REQUEST,"entity {0} was of type {1}, not of type LOCATION!", locationBarcode, entity.getEntityType());
        }

        return getResponseEntity(entity, HttpStatus.OK,null);
    }

    private static ResponseEntity<EntityResponse> getResponseEntity(SamoDisplayEntity optidevEntity, HttpStatus status,
                                                                    String pattern, Object ... arguments) {
        String error = (pattern != null) ? MessageFormat.format(pattern, arguments) : "";
        EntityResponse entityResponse = new EntityResponse(optidevEntity, error);
        return ResponseEntity.status(status).body(entityResponse);
    }
}
