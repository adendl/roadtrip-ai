package com.adendl.traveljournalai;

import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
public class TraveljournalaiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TraveljournalaiApplication.class, args);
	}

	@Bean
	public GeometryFactory geometryFactory() {
		return new GeometryFactory();
	}
}
