package com.flow.blockext.controller;

import com.flow.blockext.service.ExtensionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FileUploadController {

    private final ExtensionService extensionService;

    @PostMapping("/api/files/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("파일 이름이 없습니다.");
        }

        // 차단 확장자 목록
        List<String> blockedExtensions = extensionService.getBlockedExtensionNames();

        // 다중/복합 확장자 추출
        String[] exts = extractAllExtensions(filename); // 예: virus.tar.gz → ["tar", "gz"]

        // 파일명에 확장자 없는 경우
        if (exts.length == 0) {
            return ResponseEntity.badRequest().body("확장자가 없는 파일은 첨부할 수 없습니다.");
        }

        // 모든 확장자 중 하나라도 차단되면 업로드 거부
        for (String ext : exts) {
            if (blockedExtensions.contains(ext.toLowerCase())) {
                return ResponseEntity.badRequest().body("'" + ext + "' 확장자는 첨부할 수 없습니다.");
            }
        }

        return ResponseEntity.ok("업로드 성공!");
    }

    // 다중 확장자 추출: "virus.tar.gz" → ["tar", "gz"]
    private String[] extractAllExtensions(String filename) {
        String[] tokens = filename.split("\\.");
        if (tokens.length <= 1) return new String[0];
        String[] exts = new String[tokens.length - 1];
        System.arraycopy(tokens, 1, exts, 0, tokens.length - 1);
        return exts;
    }
}