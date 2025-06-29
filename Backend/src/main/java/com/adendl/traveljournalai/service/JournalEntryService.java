package com.adendl.traveljournalai.service;

import com.adendl.traveljournalai.model.JournalEntry;
import com.adendl.traveljournalai.model.User;
import com.adendl.traveljournalai.repository.JournalEntryRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class JournalEntryService {
    @Autowired
    private JournalEntryRepository journalEntryRepository;
    @Autowired
    //private S3Client s3Client;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public JournalEntry createEntry(JournalEntryDTO dto, MultipartFile photo, User user) throws Exception {
        JournalEntry entry = new JournalEntry();
        entry.setUser(user);
        entry.setTitle(dto.getTitle());
        entry.setContent(dto.getContent());
        entry.setLocation(geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude())));
        if (photo != null) {
            //String photoUrl = uploadPhotoToS3(photo, user.getId());
            //entry.setPhotoUrl(photoUrl);
        }
        entry.setAiSummary(callAiApi(dto.getContent()));
        //entry.setIsPublic(dto.isPublic());
        entry.setShareableLink(dto.isPublic() ? UUID.randomUUID().toString() : null);
        entry.setCreatedAt(Instant.now().toString());
        return journalEntryRepository.save(entry);
    }

    public List<JournalEntry> getUserEntries(Long userId) {
        return journalEntryRepository.findByUserId(userId);
    }

    public List<JournalEntry> getPublicEntries() {
        return journalEntryRepository.findByIsPublicTrue();
    }

    public List<JournalEntry> getEntriesNearLocation(double lat, double lng, double distance) {
        return journalEntryRepository.findWithinDistance(lat, lng, distance);
    }

    public JournalEntry getEntryByShareableLink(String shareableLink) {
        return journalEntryRepository.findAll().stream()
                .filter(entry -> shareableLink.equals(entry.getShareableLink()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Entry not found"));
    }

//    private String uploadPhotoToS3(MultipartFile photo, Long userId) throws Exception {
//        String bucketName = "travel-journal-photos";
//        String key = "photos/" + userId + "/" + UUID.randomUUID() + "-" + photo.getOriginalFilename();
//        PutObjectRequest putRequest = PutObjectRequest.builder()
//                .bucket(bucketName)
//                .key(key)
//                .build();
//        s3Client.putObject(putRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(
//                photo.getInputStream(), photo.getSize()));
//        return String.format("https://%s.s3.amazonaws.com/%s", bucketName, key);
//    }

    private String callAiApi(String content) {
        // Placeholder: Integrate with xAI's Grok API (see https://x.ai/api)
        return "AI-generated summary for: " + content.substring(0, Math.min(content.length(), 50));
    }
}
