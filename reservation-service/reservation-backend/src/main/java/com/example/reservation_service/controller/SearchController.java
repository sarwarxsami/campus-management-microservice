package com.example.reservation_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservation_service.model.Reservation;
import com.example.reservation_service.service.SearchService;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final SearchService service;

    public SearchController(SearchService service) {
        this.service = service;
    }

    @GetMapping
    public List<Reservation> getSearch() {
        return service.getSearch();
    }

    @GetMapping("/location")
    public List<Reservation> getSearchLocation(@RequestParam String locationId) {
        return service.getSearchLocation(locationId);
    }

    @GetMapping("/resource")
    public List<Reservation> getSearchResource(@RequestParam String resourceId) {
        return service.getSearchResource(resourceId);
    }

    @GetMapping("/user")
    public List<Reservation> getSearchUser(@RequestParam String userId) {
        return service.getSearchUser(userId);
    }

    @GetMapping("/descriptor")
    public List<Reservation> getSearchDescriptor(@RequestParam String descriptorId) {
        return service.getSearchDescriptor(descriptorId);
    }

    @GetMapping("/currentState")
    public List<Reservation> getSearchCurrentState(@RequestParam String currentState) {
        return service.getSearchCurrentState(currentState);
    }
}