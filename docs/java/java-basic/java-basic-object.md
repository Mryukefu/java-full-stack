---
lang: zh-CN
title: 页面的标题
description: 页面的描述
---

[[toc]]

# java基础面向对象
  ## 三大特性
   ### 继承
 * 定义：继承是 是一个ls-a 的关系，他拥有并且扩展了被继承者，所以 继承应该遵循里氏替换原则，子类对象必须能够替换掉所有父类对象。
 *
 * 优点：
 * 避免重复代码的编写
 * 可以进行向上转型，实现代码的抽象衔接
 * 缺点
 * 代码没有遵循里氏替换原则 对系统是灾难性的
 * 继承有时候设计的粒度太细，造成类爆炸
 * 父类不能使用子类的函数 
```java
 public class InheritStudy {
 
 
     @Test
     public void inheritTest(){
         Animal animal = new Bird();
         animal.run();
     }
 
       class Animal{
         private String foot;
 
         public Boolean run (){
             return true;
         }
 
     }
       class Bird extends Animal {
         private String foot;
         public Boolean fly(){
             return true;
         }
 
     }
 
 } 
```
   ### 封装
    * 定义：是对数据及函数内部抽象为一个不可分割的整体，对外提供更加简单直接的访问，或者使用方式，
    * 开发者不需要 了解具体的实现细节，可以直接使用
    * 1： 优点
    * （一） 代码角度
    * 1：提高代码的复用性，进而提高代码的可维护性
    * 2：更加容易定位问题
    * 3：有效的调节性能，更能定位那些模块影响性能
    * （二）系统角度
    * 1：减少系统的偶尔性，避免一处有问题，整个系统都不能用了
```java
    public class PackStudy {
    
        public  void main(String[] args) {
    
        }
    
        @Test
        public void packStudyTest(){
            People people = new People();
            people.setAge(10);
            System.out.println("成年了没有："+people.isAdult());
        }
    
        public  class People{
            
            private int age;
            private String name;
            private int gender;
    
            /**
             *  是否成年
             * @return
             */
            public Boolean isAdult(){
               return this.age>17?true:false;
            }
    
            public int getAge() {
                return age;
            }
    
            public void setAge(int age) {
                this.age = age;
            }
    
            public String getName() {
                return name;
            }
    
            public void setName(String name) {
                this.name = name;
            }
    
            public int getGender() {
                return gender;
            }
    
            public void setGender(int gender) {
                this.gender = gender;
            }
        }
    
    }
````
   ### 多态
 * 多态分为编译时多态和运行时多态:
 * 编译时多态主要指方法的重载
 * 运行时多态指程序中定义的对象引用所指向的具体类型在运行期间才确定 运行时多态有三个条件: 
 * 继承 覆盖(重写) 向上转型 下面的代码中，乐器类(Instrument)有两个子类:Wind 和 Percussion，
 * 它们都覆盖了父类的 play() 方法，并且在 main() 方法中使用父类 Instrument 来引用 Wind 和 Percussion 对象。
 * 在 Instrument 引用调用 play() 方法时，会执行实际引用对象所在类的 play() 方法，而不是 Instrument 类的方法。   
```java
public class Instrument {
    public void play() {
        System.out.println("Instument is playing...");
    }
}

class Wind extends Instrument {
    @Override
    public void play() {
        System.out.println("Wind is playing...");
    }
}

class Percussion extends Instrument {
    @Override
    public void play() {
        System.out.println("Percussion is playing...");
    }
}

class Music {
    public static void main(String[] args) {
        List<Instrument> instruments = new ArrayList<>();
        instruments.add(new Wind());
        instruments.add(new Percussion());
        for(Instrument instrument : instruments) {
            instrument.play();
        }
    }
}
````
  ## 类图
   面向对象的一种表达关系，小对象组合成大对象，他们之间有依赖，有包含等关系，构成复杂对象，
   完成顶级对象具备的功能，顶级对象功能委托下一级对象去实现功能。类图是展示对象之间关联关系的表示形式。
 
   ### 泛化关系
   用来描述继承关系，在 Java 中使用 extends 关键字,实线条。
   -- 类图采用虚拟箭头表示
   ```java
     public class ParamCommon {
       
         public class Param  extends  ParamCommon{
     
         }
     }
     
 ````
   ![alt ](/classUML/param_16400006116230.png) 
    
   ### 实现关系
   用来实现一个接口，在 Java 中使用 implement 关键字。采用实箭头，虚线条。
```java
   public class ServiceImpl implements Service {

    }
 `````
   ![alt ](/classUML/service_16400019009237.png) 

   ### 聚合关系
   表示整体由部分组成，但是整体和部分不是强依赖的，整体不存在了部分还是会存在。
   
   
   
   ### 组合关系
   和聚合不同，组合中整体和部分是强依赖的，整体不存在了部分也不存在了。
   比如公司和部门，公司没了部门就不存在了。
   但是公司和员工就属于聚合关系了，因为公司没了员工还在
   
   ### 依赖关系   
   和关联关系不同的是，依赖关系是在运行过程中起作用的。
   A 类和 B 类是依赖关系主要有三种形式: 
   A 类是 B 类中的(某中方法的)局部变量； 
   A 类是 B 类方法当中的一个参数； 
   A 类向 B 类发送消息，从而影响 B 类发生变化；
   
   
   ### 关联关系   
   表示不同类对象之间有关联，这是一种静态关系，与运行过程的状态无关，在最开始就可以确定。
   因此也可以用 1 对 1、多对 1、多对多这种关联关系来表示。
   比如学生和学校就是一种关联关系，一个学校可以有很多学生，但是一个学生只属于一个学校，
   因此这是一种多对一的关系，在运行开始之前就可以确定。






