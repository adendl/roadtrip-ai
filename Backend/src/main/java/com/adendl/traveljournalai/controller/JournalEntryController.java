package com.adendl.traveljournalai.controller;

import com.adendl.traveljournalai.model.JournalEntry;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.service.JournalEntryDTO;
import com.adendl.traveljournalai.service.JournalEntryService;
import com.adendl.traveljournalai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/entries")
public class JournalEntryController {
    @Autowired
    private JournalEntryService journalEntryService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(
            @RequestPart("entry") JournalEntryDTO entryDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo) throws Exception {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findById(Long.valueOf(auth.getName()));
        JournalEntry entry = journalEntryService.createEntry(entryDTO, photo, user);
        return ResponseEntity.ok(entry);
    }

    @GetMapping("/my")
    public ResponseEntity<List<JournalEntry>> getMyEntries() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<JournalEntry> entries = journalEntryService.getUserEntries(Long.valueOf(auth.getName()));
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/public")
    public ResponseEntity<List<JournalEntry>> getPublicEntries() {
        return ResponseEntity.ok(journalEntryService.getPublicEntries());
    }

    @GetMapping("/near")
    public ResponseEntity<List<JournalEntry>> getEntriesNear(
            @RequestParam double lat, @RequestParam double lng, @RequestParam double distance) {
        return ResponseEntity.ok(journalEntryService.getEntriesNearLocation(lat, lng, distance));
    }

    @GetMapping("/share/{shareableLink}")
    public ResponseEntity<String> getSharedEntry(@PathVariable String shareableLink) {
        JournalEntry entry = journalEntryService.getEntryByShareableLink(shareableLink);
        // Generate HTML for export
        String html = String.format(
                "<html><body><h1>%s</h1><p>%s</p>%s<p>%s</p></body></html>",
                entry.getTitle(),
                entry.getContent(),
                entry.getPhotoUrl() != null ? "<img src=\"" + entry.getPhotoUrl() + "\" width=\"300\"/>" : "",
                entry.getAiSummary() != null ? entry.getAiSummary() : ""
        );
        return ResponseEntity.ok(html);
    }
}