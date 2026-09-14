package com.example.create_service.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.create_service.model.Location;
import com.example.create_service.repository.LocationRepo;

@Service
public class LocationService implements BaseService {
    LocationRepo repo;

    public LocationService(LocationRepo repo) {
        this.repo = repo;
    }

    @Override
    public boolean create(Map<String, String> request) {
        Location location = new Location();
        location.setName(request.get("name"));

        return repo.save(location) != null;
    }
}