package com.example.create_service.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.create_service.model.Descriptor;
import com.example.create_service.repository.DescriptorRepo;

@Service
public class DescriptorService implements BaseService{
    DescriptorRepo repo;

    public DescriptorService(DescriptorRepo repo) {
        this.repo = repo;
    }

    @Override
    public boolean create(Map<String, String> request) {
        Descriptor descriptor = new Descriptor();
        descriptor.setDescription(request.get("description"));

        return repo.save(descriptor) != null;
    }
}
