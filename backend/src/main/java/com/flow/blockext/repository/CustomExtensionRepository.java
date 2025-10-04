package com.flow.blockext.repository;

import com.flow.blockext.entity.CustomExtension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CustomExtensionRepository extends JpaRepository<CustomExtension, Long> {
    Optional<CustomExtension> findByNameIgnoreCase(String name);

    @Modifying
    @Query(value = "DELETE FROM custom_extensions", nativeQuery = true)
    void deleteAllCustom();
}