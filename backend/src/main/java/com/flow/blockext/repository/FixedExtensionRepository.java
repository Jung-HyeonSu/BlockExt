package com.flow.blockext.repository;

import com.flow.blockext.entity.FixedExtension;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FixedExtensionRepository extends JpaRepository<FixedExtension, Long> {
    Optional<FixedExtension> findByNameIgnoreCase(String name);
}