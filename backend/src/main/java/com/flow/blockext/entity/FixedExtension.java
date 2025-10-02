package com.flow.blockext.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fixed_extensions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedExtension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private boolean blocked;
}