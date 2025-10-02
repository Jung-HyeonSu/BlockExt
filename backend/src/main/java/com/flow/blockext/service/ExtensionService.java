package com.flow.blockext.service;

import com.flow.blockext.entity.FixedExtension;
import com.flow.blockext.entity.CustomExtension;
import com.flow.blockext.repository.FixedExtensionRepository;
import com.flow.blockext.repository.CustomExtensionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public CustomExtension addCustomExtension(String name) {
        CustomExtension ext = CustomExtension.builder().name(name).build();
        return customExtensionRepository.save(ext);
    }

    // 커스텀 확장자 삭제
    public void deleteCustomExtension(String name) {
        CustomExtension ext = customExtensionRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Not found"));
        customExtensionRepository.delete(ext);
    }
}