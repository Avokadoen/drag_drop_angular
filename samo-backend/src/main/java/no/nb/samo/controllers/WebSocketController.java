package no.nb.samo.controllers;

import no.nb.samo.model.EntityCreate;
import no.nb.samo.model.EntityMove;
import no.nb.samo.model.EntityWSEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

import java.text.MessageFormat;

// TODO: merge MocktidevInterfaceController with this
@Controller
public class WebSocketController {
    private final String mocktidevMoveUrl;
    private final String mocktidevCreateUrl;
    private final String mocktidevDeleteUrl;

    public WebSocketController(@Value("${samo.optidevApiUrl}") String mocktidevUrl) {
        mocktidevMoveUrl    = MessageFormat.format("{0}/move", mocktidevUrl);
        mocktidevCreateUrl  = MessageFormat.format("{0}/create", mocktidevUrl);
        mocktidevDeleteUrl  = MessageFormat.format("{0}/delete", mocktidevUrl);
    }

    @MessageMapping("/storage_entity_move")
    @SendTo("/stomp_broker/work_area_move")
    public EntityWSEvent wsMove(@Payload EntityWSEvent event) {
        RestTemplate restTemplate = new RestTemplate();
        EntityMove move = new EntityMove(event.getSource().getBarcode(), event.getNewParentBarcode());

        if (move.getNewParentBarcode().equals("deleteList")) {
            restTemplate.delete(MessageFormat.format("{0}/{1}", this.mocktidevDeleteUrl, event.getSource().getBarcode()));
        } else {
            restTemplate.postForEntity(this.mocktidevMoveUrl, move, EntityMove.class);
        }

        return event;
    }

    @MessageMapping("/storage_entity_create")
    @SendTo("/stomp_broker/work_area_create")
    public EntityWSEvent wsCreate(@Payload EntityWSEvent event) {
        RestTemplate restTemplate = new RestTemplate();
        EntityCreate create = new EntityCreate(event.getSource().getBarcode(), event.getNewParentBarcode(), event.getSource().getEntityType());
        restTemplate.postForEntity(this.mocktidevCreateUrl, create, EntityCreate.class);

        return event;
    }
}
