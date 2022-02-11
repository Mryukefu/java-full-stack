---
lang: zh-CN
title: 页面的标题
description: 页面的描述
---
[[toc]]
# Java 基础 - 泛型机制详解
  ## 泛型作用
  * 参数化类型(在不创建新的类型的情况下，通过泛型指定的不同类型来控制形参具体限制的类型）。也就是说在泛型使用过程中，
  操作的数据类型被指定为一个参数，这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法,方法的复用性，增强
  
  ```java
  private static int add(int a, int b) {
      System.out.println(a + "+" + b + "=" + (a + b));
      return a + b;
  }
  
  private static float add(float a, float b) {
      System.out.println(a + "+" + b + "=" + (a + b));
      return a + b;
  }
  
  private static double add(double a, double b) {
      System.out.println(a + "+" + b + "=" + (a + b));
      return a + b;
  }
  ```
  * 通过泛型，我们可以复用为一个方法：
  ```java
   private static <T extends Number> double add(T a, T b) {
         return a.doubleValue() + b.doubleValue();
     }
  ```
          
  ## 泛型的基本使用
  
   ### 泛型类
   * 类使用泛型，泛型可以多个
   ```java
     static class Container<T> {  // 此处可以随便写标识符号，T是type的简称
   
           List<T> list = null; 
   
           public Container(T t){ 
               list.add(t);
           }
   
           public void add(T t){
               list.add(t);
           }
       }
   ```
   ```text
     public static void main(String[] args) {
            Container<Integer> container = new Container<>(1);
            container.add(4);
        }
   ```

   ### 泛型接口
   ```java
     
    static interface Container<T> {
           public void add(T t);
       }
   
       static class MyContainer<T extends Number> implements Container<T> {
           List<T> list = null;
   
           public MyContainer(T t) {
               list.add(t);
           }
   
           @Override
           public void add(T t) {
               list.add(t);
           }
   
       };
   ```
   ```text
     public static void main(String[] args) {
        Container<Integer> container = new MyContainer<>(1);
        container.add(4);
    }
   ```

   ### 泛型方法
   * 泛型方法，是在调用方法的时候指明泛型的具体类型,一般来讲是根据入参来判断返回的参数
   * 定义泛型方法语法格式
    <img src="/static/dist/images/java-basic-generic-4.png" width="100%">
   * 调用泛型方法语法格式 
    <img src="/static/dist/images/java-basic-generic-5.png" width="100%">
    
   ### 泛型的上下限
   * 泛型上下限是指入参或者返回参数的范围
   ```java 
   class A{}
   class B extends A {}
   
   // 如下两个方法不会报错
   public static void funA(A a) {
       // ...          
   }
   public static void funB(B b) {
       funA(b);
       // ...             
   }
   
   // 如下funD方法会报错
   public static void funC(List<A> listA) {
       // ...          
   }
   public static void funD(List<B> listB) {
       funC(listB); // Unresolved compilation problem: The method doPrint(List<A>) in the type test is not applicable for the arguments (List<B>)
       // ...             
   }
     
  ```
  ```text
    为了解决泛型中隐含的转换问题，Java泛型加入了类型参数的上下边界机制。
    <? extends A>表示该类型参数可以是A(上边界)或者A的子类类型。   
   编译时擦除到类型A，即用A类型代替类型参数。这种方法可以解决开始遇到的问题，编译器知道类型参数的范围，
    如果传入的实例类型B是在这个范围内的话允许转换，这时只要一次类型转换就可以了，运行时会把对象当做A的实例看待。
   ```
```java


public static void funC(List<? extends A> listA) {
    // ...          
}
public static void funD(List<B> listB) {
    funC(listB); // OK
    // ...             
}
```
 1.上限
```java
著作权归https://pdai.tech所有。
链接：https://www.pdai.tech/md/java/basic/java-basic-x-generic.html

class Info<T extends Number>{    // 此处泛型只能是数字类型
    private T var ;        // 定义泛型变量
    public void setVar(T var){
        this.var = var ;
    }
    public T getVar(){
        return this.var ;
    }
    public String toString(){    // 直接打印
        return this.var.toString() ;
    }
}
public class demo1{
    public static void main(String args[]){
        Info<Integer> i1 = new Info<Integer>() ;        // 声明Integer的泛型对象
    }
}
  
```
2.下限
```java
著作权归https://pdai.tech所有。
链接：https://www.pdai.tech/md/java/basic/java-basic-x-generic.html

class Info<T>{
    private T var ;        // 定义泛型变量
    public void setVar(T var){
        this.var = var ;
    }
    public T getVar(){
        return this.var ;
    }
    public String toString(){    // 直接打印
        return this.var.toString() ;
    }
}
public class GenericsDemo21{
    public static void main(String args[]){
        Info<String> i1 = new Info<String>() ;        // 声明String的泛型对象
        Info<Object> i2 = new Info<Object>() ;        // 声明Object的泛型对象
        i1.setVar("hello") ;
        i2.setVar(new Object()) ;
        fun(i1) ;
        fun(i2) ;
    }
    public static void fun(Info<? super String> temp){    // 只能接收String或Object类型的泛型，String类的父类只有Object类
        System.out.print(temp + ", ") ;
    }
}

```

```text
小结:
<?> 无限制通配符
<? extends E> extends 关键字声明了类型的上界，表示参数化的类型可能是所指定的类型，或者是此类型的子类
<? super E> super 关键字声明了类型的下界，表示参数化的类型可能是指定的类型，或者是此类型的父类
// 使用原则《Effictive Java》
// 为了获得最大限度的灵活性，要在表示 生产者或者消费者 的输入参数上使用通配符，使用的规则就是：生产者有上限、消费者有下限
1. 如果参数化类型表示一个 T 的生产者，使用 < ? extends T>;
2. 如果它表示一个 T 的消费者，就使用 < ? super T>；
3. 如果既是生产又是消费，那使用通配符就没什么意义了，因为你需要的是精确的参数类型。
```   
```java
private  <E extends Comparable<? super E>> E max(List<? extends E> e1) {
    if (e1 == null){
        return null;
    }
    //迭代器返回的元素属于 E 的某个子类型
    Iterator<? extends E> iterator = e1.iterator();
    E result = iterator.next();
    while (iterator.hasNext()){
        E next = iterator.next();
        if (next.compareTo(result) > 0){
            result = next;
        }
    }
    return result;
}

```
上述代码中的类型参数 E 的范围是<E extends Comparable<? super E>>，我们可以分步查看： 
* 要进行比较，所以 E 需要是可比较的类，因此需要 extends Comparable<…>（注意这里不要和继承的 extends 搞混了，不一样） 

* Comparable< ? super E> 要对 E 进行比较，即 E 的消费者，所以需要用 super 

* 而参数 List< ? extends E> 表示要操作的数据是 E 的子类的列表，指定上限，这样容器才够大 多个限制
3.1
使用&符号
```java
public class Client {
    //工资低于2500元的上斑族并且站立的乘客车票打8折
    public static <T extends Staff & Passenger> void discount(T t){
        if(t.getSalary()<2500 && t.isStanding()){
            System.out.println("恭喜你！您的车票打八折！");
        }
    }
    public static void main(String[] args) {
        discount(new Me());
    }
}
```
   ### 泛型数组
   
  ## 深入理解泛型
   ### 如何理解Java中的泛型是伪泛型？泛型中类型擦除
   ### 泛型接口
   ### 泛型方法
   ### 泛型的上下限
   ### 泛型数组
  
    
       
 





