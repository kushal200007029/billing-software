package main

import (
	"log"
	"net/http"
	"strconv"
	"sync"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

type Product struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Stock int     `json:"stock"`
}

var (
	products = []Product{
		{ID: 1, Name: "Enterprise License", Price: 499.99, Stock: 999},
		{ID: 2, Name: "Professional License", Price: 199.99, Stock: 999},
		{ID: 3, Name: "Basic License", Price: 49.99, Stock: 999},
	}
	nextID = 4
	mu     sync.Mutex
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/products", func(c *gin.Context) {
		mu.Lock()
		defer mu.Unlock()
		c.JSON(http.StatusOK, products)
	})

	r.GET("/api/products/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid ID"})
			return
		}
		mu.Lock()
		defer mu.Unlock()
		for _, p := range products {
			if p.ID == id {
				c.JSON(http.StatusOK, p)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
	})

	r.POST("/api/products", func(c *gin.Context) {
		var p Product
		if err := c.ShouldBindJSON(&p); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		mu.Lock()
		p.ID = nextID
		nextID++
		products = append(products, p)
		mu.Unlock()
		c.JSON(http.StatusCreated, p)
	})

	log.Println("Product Service running on port 8081")
	r.Run(":8081")
}
