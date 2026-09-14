package com.example.reservation_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.reservation_service.model.Reservation;
import com.example.reservation_service.repository.ReservationRepo;

@Service
public class SearchService{

    private final ReservationRepo repo;

    public SearchService(ReservationRepo repo){
        this.repo = repo;
    }
    public List<Reservation>getSearchLocation(String location){
        return repo.findByLocationId(Integer.parseInt(location));
    }
    public List<Reservation>getSearchResource(String resource){
        return repo.findByResourceId(Integer.parseInt(resource));
    }
    public List<Reservation>getSearch(){
        return repo.findAll();
    }
    public List<Reservation>getSearchUser(String user){
        return repo.findByUserId(Integer.parseInt(user));
    }
    public List<Reservation>getSearchDescriptor(String descriptor){
        return repo.findByDescriptorId(Integer.parseInt(descriptor));
    }
    public List<Reservation>getSearchCurrentState(String currentState){
        return repo.findByCurrentState(Integer.parseInt(currentState));
    }
}