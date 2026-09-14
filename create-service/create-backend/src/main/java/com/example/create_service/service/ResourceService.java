package com.example.create_service.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.create_service.model.Resource;
import com.example.create_service.repository.ResourceRepo;

@Service
public class ResourceService implements BaseService{
    ResourceRepo repo;

    public ResourceService(ResourceRepo repo) {
        this.repo = repo;
    }

    @Override
    public boolean create(Map<String, String> request) {
        Resource resource = new Resource();
        resource.setName(request.get("name"));
        resource.setType(request.get("type"));
        resource.setLocationId(Integer.parseInt(request.get("location_id")));
        resource.setAvailable(true);

        if (request.containsKey("capacity") && request.get("capacity") != null) {
            resource.setCapacity(Integer.parseInt(request.get("capacity")));
        }

        return repo.save(resource)!=null;
    }
}
