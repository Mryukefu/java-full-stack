---
lang: zh-CN
title: 页面的标题
description: 页面的描述
---

[[toc]]



# juc

##  进程
### 进程的概念
*  程序由指令和数据组成，但这些指令要运行，数据要读写，就必须将指令加载至 CPU，数据加载至内存。在
   指令运行过程中还需要用到磁盘、网络等设备。进程就是用来加载指令、管理内存、管理 IO 的。
*  当一个程序被运行，从磁盘加载这个程序的代码至内存，这时就开启了一个进程。
*  进程就可以视为程序的一个实例。大部分程序可以同时运行多个实例进程（例如记事本、画图、浏览器
   等），也有的程序只能启动一个实例进程（例如网易云音乐、360 安全卫士等）
    
###  线程的概念
*  一个进程之内可以分为一到多个线程。
*  一个线程就是一个指令流，将指令流中的一条条指令以一定的顺序交给 CPU 执行
*  Java 中，线程作为最小调度单位，进程作为资源分配的最小单位。 在 windows 中进程是不活动的，只是作
   为线程的容器
   
### 进程跟线程对比
*  进程隔离的是程序，一个进程会有多个线程
*  进行之间通信需要使用http 或者其他跨端协议  线程通信相对简单，因为它们共享进程内的内存，一个例子是多个线程可以访问同一个共享变量
*  进程是内存供给线程使用
*  线程更轻量，线程上下文切换成本一般上要比进程上下文切换低
*  进程是模块级别，线程是CPU 指令级别。CPU 执行的最小单位。

### 并行与并发
*  并行是基于多核CPU才有的，他可以做到同一时间执行相同的逻辑
*  并发是微观串行，宏观并行。它需要做任务调度器，将 cpu 的时间片（windows下时间片最小约为 15 毫秒）分给不同的程序使用


## Java 线程

  
### java 线程创建
 #### 使用
* 创建线程的方式主要有两种方式 继承thread 实现Runnable<br>
  继承thread
  
  
```java
    public static void main(String[] args) {
        new Thread(()->{
            System.out.println("implements runnable");
        }).start();

        MyThread myThread = new MyThread();
        myThread.start();

    }

  ``` 
   接收 runnable 实现类 方式
```java

     MyThread myThread = new MyThread();
            myThread.start();
    static class  MyThread extends Thread{
        @Override
        public void run() {

            System.out.println(" extends Thread");
        }
    }
```
   接收 Callable 实现类方式  主线程阻塞，同步等待 task 执行完毕的结果
```java

        FutureTask<Integer> futureTask = new FutureTask<>(() -> {
            return 1;
        });
        //  可以指定线程名称，默认是Thread-" + nextThreadNum();
        new Thread(futureTask, "t3").start();
        try {
            System.out.println(futureTask.get());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

```
::: warning 
主线程阻塞，同步等待 task 执行完毕的结果
:::
#### 原理之 Thread 与 Runnable 的关系
  - Thread implements Runnable  调用start方法后，会执行thread 的run 方法，判断 runnable 对象是不是为空，不为空就调用runable 的run 方法
 ```java   
    private Runnable target;
    @Override
      public void run() {
          if (target != null) {
              target.run();
          }
      }
 ```      

###  查看线程

#### windows
* tasklist 查看进程列表
* taskkill 杀死进程

#### linux
 * ps -ef |grep  java
 * ps -fT -p &lt;PID&gt; 查看某个进程（PID）的所有线程
 * kill -9 杀死进程
 * top 按大写 H 切换是否显示线程
 * top -H -p &lt;PID&gt; 查看某个进程（PID）的所有线程

#### java
 * jps 命令查看所有 Java 进程
 * jstack &lt;PID&gt; 查看某个 Java 进程（PID）的所有线程状态
 * jconsole 来查看某个 Java 进程中线程的运行情况（图形界面）

###  线程API
###  线程状态
 
























