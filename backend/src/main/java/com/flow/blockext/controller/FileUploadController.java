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
        if (filename == null) {
            return ResponseEntity.badRequest().body("파일 이름이 없습니다.");
        }

        String ext = extractExtension(filename);
        List<String> blockedExtensions = extensionService.getBlockedExtensionNames();

        if (blockedExtensions.contains(ext.toLowerCase())) {
            return ResponseEntity.badRequest().body("'" + ext + "' 확장자는 업로드할 수 없습니다.");
        }

        return ResponseEntity.ok("업로드 성공!");
    }

    private String extractExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        if (dot >= 0 && dot < filename.length() - 1) {
            return filename.substring(dot + 1).toLowerCase();
        }
        return "";
    }
}