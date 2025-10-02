package com.flow.blockext.repository;

import com.flow.blockext.entity.CustomExtension;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomExtensionRepository extends JpaRepository<CustomExtension, Long> {
    Optional<CustomExtension> findByName(String name);
}