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
  ::: warning 
  我们通过泛型背后的类型擦除以及相关的问题来进一步理解泛型
  :::
  * 泛型的类型擦除原则是<br/>
     1.消除类型参数声明，即删除<>及其包围的部分<br/>
     2.根据类型参数的上下界推断并替换所有的类型参数为原生态类型：如果类型参数是无限制通配符或没有上下界限定则替换为Object，
     如果存在上下界限定则根据子类替换原则取类型参数的最左边限定类型（即父类）<br/>
     3.为了保证类型安全，必要时插入强制类型转换代码<br/>
     4.自动产生“桥接方法”以保证擦除类型后的代码仍然具有泛型的“多态性”<br/>
  * 那么如何进行擦除的呢 主要分为  无限制类型擦除，有限制类型擦除 两种
  * 擦除类定义中的类型参数 - 无限制类型擦除
        当类定义中的类型参数没有任何限制时，在类型擦除中直接被替换为Object，即形如&lt;T&gt;和&lt;?&gt;的类型参数都被替换为Object     
   <img src="/static/dist/images/java-basic-generic-1.png" width="100%">
   * 擦除类定义中的类型参数 - 有限制类型擦除
   <img src="/static/dist/images/java-basic-generic-2.png" width="100%">
   * 擦除方法定义中的类型参数
   <img src="/static/dist/images/java-basic-generic-3.png" width="100%">
   ### 伪泛型之泛型擦除
   ::: warning 
    Java泛型这个特性是从JDK 1.5才开始加入的，因此为了兼容之前的版本，Java泛型的实现采取了“伪泛型”的策略，即Java在语法上支持泛型，
    但是在编译阶段会进行所谓的“类型擦除”（Type Erasure），将所有的泛型表示（尖括号中的内容）都替换为具体的类型（其对应的原生态类型），
    就像完全没有泛型一样。理解类型擦除对于用好泛型是很有帮助的，尤其是一些看起来“疑难杂症”的问题，弄明白了类型擦除也就迎刃而解了。
   :::
   
     
   ### 泛型的编译期检查
   * Java编译器是通过先检查代码中泛型的类型，然后在进行类型擦除，再进行编译。
   ```java
public static  void main(String[] args) {  

    ArrayList<String> list = new ArrayList<String>();  
    list.add("123");  
    list.add(123);//编译错误  
}
  
   ```
   ### 泛型多态之桥接方法
   ::: warning
   类型擦除会造成多态的冲突，而JVM解决方法就是桥接方法。
   :::
   * 现在有这样一个泛型类
   ```java
class Pair<T> {  

    private T value;  

    public T getValue() {  
        return value;  
    }  

    public void setValue(T value) {  
        this.value = value;  
    }  
}

   ```
* 然后我们想要一个子类继承它。 
```java
class DateInter extends Pair<Date> {  

    @Override  
    public void setValue(Date value) {  
        super.setValue(value);  
    }  

    @Override  
    public Date getValue() {  
        return super.getValue();  
    }  
}


   ```
* 在这个子类中，我们设定父类的泛型类型为Pair&lt;Date&gt;，在子类中，我们覆盖了父类的两个方法，我们的原意是这样的：将父类的泛型类型限定为Date，那么父类里面的两个方法的参数都为Date类型。
 ```java
public Date getValue() {  
    return value;  
}  

public void setValue(Date value) {  
    this.value = value;  
}


   ```
  * 所以，我们在子类中重写这两个方法一点问题也没有，实际上，从他们的@Override标签中也可以看到，一点问题也没有。
  实际上是这样的吗？ 分析：实际上，类型擦除后，父类的的泛型类型全部变为了原始类型Object，所以父类编译之后会变成下面的样子：
 ```java
class Pair {  
    private Object value;  

    public Object getValue() {  
        return value;  
    }  

    public void setValue(Object  value) {  
        this.value = value;  
    }  
} 

   ```
* 再看子类的两个重写的方法的类型：
```java
@Override  
public void setValue(Date value) {  
    super.setValue(value);  
}  
@Override  
public Date getValue() {  
    return super.getValue();  
}
```
* 先来分析setValue方法，父类的类型是Object，而子类的类型是Date，参数类型不一样，这如果实在普通的继承关系中，根本就不会是重写，而是重载。 我们在一个main方法测试一下：
```java
public static void main(String[] args) throws ClassNotFoundException {  
        DateInter dateInter = new DateInter();  
        dateInter.setValue(new Date());                  
        dateInter.setValue(new Object()); //编译错误  根本就没有这样的一个子类继承自父类的Object类型参数的方法
}

```
* 如果是重载，那么子类中两个setValue方法，一个是参数Object类型，一个是Date类型，可是我们发现，根本就没有这样的一个子类继承自父类的Object类型参数的方法。所以说，却是是重写了，而不是重载了。

```java
class com.tao.test.DateInter extends com.tao.test.Pair<java.util.Date> {  
  com.tao.test.DateInter();  
    Code:  
       0: aload_0  
       1: invokespecial #8                  // Method com/tao/test/Pair."<init>":()V  
       4: return  

  public void setValue(java.util.Date);  //我们重写的setValue方法  
    Code:  
       0: aload_0  
       1: aload_1  
       2: invokespecial #16                 // Method com/tao/test/Pair.setValue:(Ljava/lang/Object;)V  
       5: return  

  public java.util.Date getValue();    //我们重写的getValue方法  
    Code:  
       0: aload_0  
       1: invokespecial #23                 // Method com/tao/test/Pair.getValue:()Ljava/lang/Object;  
       4: checkcast     #26                 // class java/util/Date  
       7: areturn  

  public java.lang.Object getValue();     //编译时由编译器生成的巧方法  
    Code:  
       0: aload_0  
       1: invokevirtual #28                 // Method getValue:()Ljava/util/Date 去调用我们重写的getValue方法;  
       4: areturn  

  public void setValue(java.lang.Object);   //编译时由编译器生成的巧方法  
    Code:  
       0: aload_0  
       1: aload_1  
       2: checkcast     #26                 // class java/util/Date  
       5: invokevirtual #30                 // Method setValue:(Ljava/util/Date; 去调用我们重写的setValue方法)V  
       8: return  
}

```
* 从编译的结果来看，我们本意重写setValue和getValue方法的子类，竟然有4个方法，其实不用惊奇，最后的两个方法，就是编译器自己生成的桥方法。
可以看到桥方法的参数类型都是Object，也就是说，子类中真正覆盖父类两个方法的就是这两个我们看不到的桥方法。
而打在我们自己定义的setvalue和getValue方法上面的@Oveerride只不过是假象。而桥方法的内部实现，就只是去调用我们自己重写的那两个方法。 
所以，虚拟机巧妙的使用了桥方法，来解决了类型擦除和多态的冲突。 不过，要提到一点，这里面的setValue和getValue这两个桥方法的意义又有不同。 
setValue方法是为了解决类型擦除与多态之间的冲突。 而getValue却有普遍的意义，怎么说呢，如果这是一个普通的继承关系

    
       
 





