package com.spear.spear_backend.repository;

import com.spear.spear_backend.model.Poem;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PoemRepository extends MongoRepository<Poem, String> {
	@Query("{name:'?0'}")
	Poem findItemByName(String name);
	
	@Query(value="{category:'?0'}", fields="{'name' : 1, 'quantity' : 1}")
	List<Poem> findAll(String category);
	
	public long count();
}

