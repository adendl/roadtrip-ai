package com.adendl.traveljournalai;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=false",
    "jwt.secret=KkhKkw5AOvp4DAMGu2DLEMaXO1z6epEnPgLcY0hzmGk=",
    "openai.api.key=test-api-key"
})
class TraveljournalaiApplicationTests {

	@Test
	void contextLoads() {
	}

}
