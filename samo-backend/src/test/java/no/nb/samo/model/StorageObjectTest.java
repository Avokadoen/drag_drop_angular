package no.nb.samo.model;

import org.junit.Assert;
import org.junit.Test;

import java.util.ArrayList;

public class StorageObjectTest {

    @Test
    public void sortById() {
        ArrayList<StorageObject> a = new ArrayList<>(2);
        StorageObject s1 = new StorageObject();
        StorageObject s2 = new StorageObject();
        s1.setNbId("test1");
        s2.setNbId("test2");
        a.add(s1);
        a.add(s2);
        a.sort(new StorageObject.SortbyNbId());
        Assert.assertEquals("test1", a.get(0).getNbId());
    }
}
