package com.example.create_service.service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.create_service.model.Descriptor;
import com.example.create_service.model.Resource;
import com.example.create_service.repository.DescriptorRepo;
import com.example.create_service.repository.ResourceRepo;

@Service
public class ResourceDescriptorService implements BaseService {
    
    @Autowired
    private ResourceRepo resourceRepo;
    
    @Autowired
    private DescriptorRepo descriptorRepo;

    @Override
    public boolean create(Map<String, String> request) {
        String resourceIdsStr = request.get("resource_ids");
        String descriptorIdsStr = request.get("descriptor_ids");
        
        List<Integer> resourceIds = parseIds(resourceIdsStr);
        List<Integer> descriptorIds = parseIds(descriptorIdsStr);
        
        if (resourceIds == null || descriptorIds == null || 
            resourceIds.isEmpty() || descriptorIds.isEmpty()) {
            return false;
        }
        
        for (Integer resourceId : resourceIds) {
            Resource resource = resourceRepo.findById(resourceId).orElse(null);
            if (resource == null) continue;
            
            for (Integer descriptorId : descriptorIds) {
                Descriptor descriptor = descriptorRepo.findById(descriptorId).orElse(null);
                if (descriptor != null) {
                    resource.getDescriptors().add(descriptor);
                }
            }
            
            resourceRepo.save(resource);
        }
        
        return true;
    }
    
    private List<Integer> parseIds(String ids) {
        if (ids == null || ids.trim().isEmpty()) {
            return null;
        }
        return Arrays.stream(ids.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .collect(Collectors.toList());
    }
}