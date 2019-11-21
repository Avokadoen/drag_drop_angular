package no.nb.samo.mocktidev.model;

import javax.persistence.*;

@javax.persistence.Entity
public class Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 9)
    private EntityType type;

    @Column(nullable = false, length = 40, unique = true)
    private String barcode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn()
    private Entity parent;

    public Entity() {
    }

    public Entity(EntityType type, String barcode) {
        this.type = type;
        this.barcode = barcode;
    }

    public Entity(EntityType type, String barcode, Entity parent) {
        this.type = type;
        this.barcode = barcode;
        this.parent = parent;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public EntityType getType() {
        return type;
    }

    public void setType(EntityType type) {
        this.type = type;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public Entity getParent() {
        return parent;
    }

    public void setParent(Entity parent) {
        this.parent = parent;
    }

}
