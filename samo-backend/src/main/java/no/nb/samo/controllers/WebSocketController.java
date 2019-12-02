package no.nb.samo.controllers;

import no.nb.samo.model.EntityWSEvent;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/storage_entity_change")
    @SendTo("/stomp_broker/work_area")
    public EntityWSEvent testReceived(@Payload EntityWSEvent event) {
        return event;
    }
}
