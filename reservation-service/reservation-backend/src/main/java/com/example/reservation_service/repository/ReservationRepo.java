package com.example.reservation_service.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.reservation_service.model.Reservation;

public interface ReservationRepo extends JpaRepository<Reservation, Integer> {

    List<Reservation> findByUserId(int userId);

    List<Reservation> findByResourceId(int resourceId);

    List<Reservation> findByResourceIdIn(List<Integer> resourceIds);

    List<Reservation> findByCurrentState(Integer currentState);


    @Query(value = """
            SELECT res.* FROM reservation res
            JOIN resource r ON r.id = res.resource_id
            WHERE r.location_id = :locationId
            """, nativeQuery = true)
    List<Reservation> findByLocationId(@Param("locationId") int locationId);


    @Query(value = """
            SELECT DISTINCT res.* FROM reservation res
            JOIN resource r ON r.id = res.resource_id
            JOIN resource_descriptor rd ON rd.resource_id = r.id
            WHERE rd.descriptor_id = :descriptorId
            """, nativeQuery = true)
    List<Reservation> findByDescriptorId(@Param("descriptorId") int descriptorId);


    @Query("""
                SELECT COUNT(r) > 0 FROM Reservation r
                WHERE r.resourceId = :resourceId
                  AND r.currentState IN (0, 1)
                  AND r.start < :end
                  AND function('TIMESTAMPADD', MINUTE, r.duration, r.start) > :start
            """)
    boolean existsOverlap(@Param("resourceId") int resourceId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("""
                SELECT COUNT(r) > 0 FROM Reservation r
                WHERE r.resourceId = :resourceId
                  AND r.currentState IN (0, 1)
                  AND r.id <> :excludeId
                  AND r.start < :end
                  AND function('TIMESTAMPADD', MINUTE, r.duration, r.start) > :start
            """)
    boolean existsOverlapExcluding(@Param("resourceId") int resourceId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("excludeId") int excludeId);
}