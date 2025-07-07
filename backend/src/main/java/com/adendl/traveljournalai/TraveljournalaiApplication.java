package com.adendl.traveljournalai;

import org.locationtech.jts.geom.GeometryFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
public class TraveljournalaiApplication {

	private static final Logger logger = LoggerFactory.getLogger(TraveljournalaiApplication.class);

	public static void main(String[] args) {
		logger.info("Starting TraveljournalaiApplication...");
		SpringApplication.run(TraveljournalaiApplication.class, args);
		logger.info("TraveljournalaiApplication started successfully.");
	}

}
