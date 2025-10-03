package com.flow.blockext.service;

import com.flow.blockext.entity.FixedExtension;
import com.flow.blockext.entity.CustomExtension;
import com.flow.blockext.repository.FixedExtensionRepository;
import com.flow.blockext.repository.CustomExtensionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExtensionService {
    private final FixedExtensionRepository fixedExtensionRepository;
    private final CustomExtensionRepository customExtensionRepository;

    // 고정 확장자 전체 조회
    public List<FixedExtension> getAllFixedExtensions() {
        return fixedExtensionRepository.findAll();
    }

    // 커스텀 확장자 전체 조회
    public List<CustomExtension> getAllCustomExtensions() {
        return customExtensionRepository.findAll();
    }

    // 고정 확장자 차단/해제 변경
    public FixedExtension setFixedBlocked(String name, boolean blocked) {
        FixedExtension ext = fixedExtensionRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Not found"));
        ext.setBlocked(blocked);
        return fixedExtensionRepository.save(ext);
    }

    // 커스텀 확장자 추가
    @Transactional
    public CustomExtension addCustomExtension(String name) {
        String lowerName = name.toLowerCase();
        if (customExtensionRepository.findByName(lowerName).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 확장자입니다.");
        }
        try {
            CustomExtension ext = CustomExtension.builder().name(lowerName).build();
            return customExtensionRepository.save(ext);
        } catch (DataIntegrityViolationException e) {
            // Unique 제약조건 위반 (동시 insert 시)
            throw new IllegalArgumentException("이미 존재하는 확장자입니다.");
        } catch (ObjectOptimisticLockingFailureException e) {
            // 낙관적 락 충돌
            throw new RuntimeException("동시성 충돌이 발생했습니다. 다시 시도하세요.");
        }
    }

    // 커스텀 확장자 삭제
    public void deleteCustomExtension(String name) {
        CustomExtension ext = customExtensionRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Not found"));
        customExtensionRepository.delete(ext);
    }

    // 커스텀 확장자 전체 삭제
    public void deleteAllCustomExtensions() {
        customExtensionRepository.deleteAll();
    }

    // 차단된 확장자와 사용자 정의 확장자를 모두 조회하여 소문자 리스트로 반환
    public List<String> getBlockedExtensionNames() {
        List<String> fixed = fixedExtensionRepository.findAll()
            .stream().filter(FixedExtension::isBlocked)
            .map(FixedExtension::getName)
            .map(String::toLowerCase)
            .collect(Collectors.toList());
        List<String> custom = customExtensionRepository.findAll()
            .stream().map(CustomExtension::getName)
            .map(String::toLowerCase)
            .collect(Collectors.toList());
        List<String> all = new ArrayList<>();
        all.addAll(fixed);
        all.addAll(custom);
        return all;
    }
}