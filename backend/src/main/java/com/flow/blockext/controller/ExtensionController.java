package com.flow.blockext.controller;

import com.flow.blockext.entity.FixedExtension;
import com.flow.blockext.entity.CustomExtension;
import com.flow.blockext.service.ExtensionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/extensions")
@RequiredArgsConstructor
public class ExtensionController {
    private final ExtensionService extensionService;
    /**
     * 고정 확장자 전체 조회
     * GET /api/extensions/fixed
     */
    @GetMapping("/fixed")
    public List<FixedExtension> getFixed() {
        return extensionService.getAllFixedExtensions();
    }

    /**
     * 사용자 정의 확장자 전체 조회
     * GET /api/extensions/custom
     */
    @GetMapping("/custom")
    public List<CustomExtension> getCustom() {
        return extensionService.getAllCustomExtensions();
    }

    /**
     * 고정 확장자 차단 상태 변경
     * POST /api/extensions/fixed/{name}/block?blocked=true|false
     * @param name 차단 상태를 변경할 확장자 이름
     * @param blocked 차단(true)/허용(false) 여부
     */
    @PostMapping("/fixed/{name}/block")
    public FixedExtension blockFixed(@PathVariable String name, @RequestParam boolean blocked) {
        return extensionService.setFixedBlocked(name, blocked);
    }

    /**
     * 사용자 정의 확장자 추가
     * POST /api/extensions/custom?name=xxx
     * @param name 새로 추가할 확장자 이름
     */
    @PostMapping("/custom")
    public CustomExtension addCustom(@RequestParam String name) {
        return extensionService.addCustomExtension(name);
    }

    /**
     * 사용자 정의 확장자 삭제
     * DELETE /api/extensions/custom/{name}
     * @param name 삭제할 확장자 이름
     */
    @DeleteMapping("/custom/{name}")
    public void deleteCustom(@PathVariable String name) {
        extensionService.deleteCustomExtension(name);
    }

    /**
     * 사용자 정의 확장자 전체 삭제
     * DELETE /api/extensions/custom_all
     */
    @DeleteMapping("/custom_all")
    public void deleteAllCustom() {
        extensionService.deleteAllCustomExtensions();
    }
}