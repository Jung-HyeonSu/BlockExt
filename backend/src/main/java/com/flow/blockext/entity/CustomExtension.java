package com.flow.blockext.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "custom_extensions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomExtension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false, unique = true)
    private String name;
}