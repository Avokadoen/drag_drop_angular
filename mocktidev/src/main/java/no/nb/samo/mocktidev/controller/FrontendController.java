package no.nb.samo.mocktidev.controller;

import no.nb.samo.mocktidev.exception.InvalidRequestException;
import no.nb.samo.mocktidev.exception.UnreachableException;
import no.nb.samo.mocktidev.model.EntityType;
import no.nb.samo.mocktidev.model.FlattenedEntity;
import no.nb.samo.mocktidev.model.PlainEntity;
import no.nb.samo.mocktidev.service.EntityService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
public class FrontendController {
    private static final String ENTITY_OVERVIEW_URN = "/entity_overview";
    private static final String REDIRECT_TO_OVERVIEW = "redirect:" + ENTITY_OVERVIEW_URN;
    private static final String ERROR_MSG_COOKIE = "mocktiErrorMsg";
    private static final String PAGE_COOKIE = "mocktiPage";
    private static final String PAGE_SIZE_COOKIE = "mocktiSize";
    private static final int THIRTY_DAYS = 30 * 24 * 60 * 60;

    private final EntityService entityService;

    public FrontendController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping(value = "/")
    public String index(Model model) {
        model.addAttribute("plainEntity", new PlainEntity());
        return "index";
    }

    @GetMapping(value = ENTITY_OVERVIEW_URN)
    public String entityOverview(@CookieValue(value = PAGE_COOKIE, defaultValue = "0") Integer page,
                                 @CookieValue(value = PAGE_SIZE_COOKIE, defaultValue = "10") Integer size,
                                 @CookieValue(value = ERROR_MSG_COOKIE, defaultValue="") String errorMsg,
                                 @RequestParam(required = false) String barcodeQuery,
                                 Model model,
                                 HttpServletResponse response) {

        model.addAttribute("errorMsg", errorMsg);
        model.addAttribute("barcodeQuery", barcodeQuery);

        page = Math.max(page, 0);
        PageRequest pageRequest = PageRequest.of(page, size);

        Page<FlattenedEntity> flattenedEntities;
        try {
            flattenedEntities = entityService.flattenEntities(pageRequest, barcodeQuery);
        } catch (UnreachableException e) {
            return handleErrorState(e.getMessage(), response);
        }

        model.addAttribute("entities", flattenedEntities);

        int totalPages = flattenedEntities.getTotalPages();
        List<Integer> pageNumbers;
        if (totalPages > 0) {
            pageNumbers = IntStream.rangeClosed(1, totalPages)
                    .boxed()
                    .collect(Collectors.toList());
        } else {
            pageNumbers = Collections.singletonList(0);
        }
        model.addAttribute("pageNumbers", pageNumbers);

        List<Integer> pageSizes = Arrays.asList(5, 10, 20, 40, 80);
        model.addAttribute("pageSizes", pageSizes);

        model.addAttribute("newEntity", new PlainEntity());

        return "entity-overview";
    }

    @GetMapping(value = ENTITY_OVERVIEW_URN + "_search")
    public String search(@RequestParam String barcodeQuery, HttpServletResponse response) {
        response.addCookie(setCookieValue(PAGE_COOKIE, "0", THIRTY_DAYS));

        return REDIRECT_TO_OVERVIEW + "?barcodeQuery=" + barcodeQuery;
    }


    @GetMapping(value = ENTITY_OVERVIEW_URN + "_paginate")
    public String paginate(@RequestParam String barcodeQuery, @RequestParam Integer page, @RequestParam Integer size, HttpServletResponse response) {
        response.addCookie(setCookieValue(PAGE_COOKIE, page.toString(), THIRTY_DAYS));
        response.addCookie(setCookieValue(PAGE_SIZE_COOKIE, size.toString(), THIRTY_DAYS));

        return REDIRECT_TO_OVERVIEW + "?barcodeQuery=" + barcodeQuery;
    }

    // TODO: match function name
    @PostMapping("/entity_new_parent")
    public String updateParent(@RequestParam Integer entityId, @RequestParam String newParentBarcode, HttpServletResponse response) {
        // TODO: regex on barcode
        try {
            entityService.updateParent(entityId, newParentBarcode);
        } catch (InvalidRequestException e) {
            return handleErrorState(e.getUrlEncodedMessage(), response);
        }

        return REDIRECT_TO_OVERVIEW;
    }

    @Transactional
    @PostMapping("/entity_delete")
    public String delete(@RequestParam Integer entityId, HttpServletResponse response) {
        try {
            entityService.delete(entityId);
        } catch (InvalidRequestException e) {
            handleErrorState(e.getUrlEncodedMessage(), response);
        }

        return REDIRECT_TO_OVERVIEW;
    }

    @PostMapping("/entity_create")
    public String create(@RequestParam String entityBarcode, @RequestParam String parentBarcode, @RequestParam EntityType entityType, HttpServletResponse response) {
        try {
            Integer parentId
                    = (parentBarcode != null && !parentBarcode.isEmpty()) ? entityService.getEntityByBarcode(parentBarcode).getId() : null;

            PlainEntity newEntity = new PlainEntity(entityType, entityBarcode, parentId);
            entityService.create(newEntity);
        } catch (InvalidRequestException e) {
            handleErrorState(e.getUrlEncodedMessage(), response);
        }

        return REDIRECT_TO_OVERVIEW ;
    }

    private static String handleErrorState(String message, HttpServletResponse response) {
        response.addCookie(setCookieValue(ERROR_MSG_COOKIE, message, 3));
        return REDIRECT_TO_OVERVIEW;
    }

    private static Cookie setCookieValue(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(maxAge);
        return cookie;
    }
}
