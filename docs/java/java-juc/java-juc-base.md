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

####  sleep
 * 调用 sleep 会让当前线程从 Running 进入 Timed Waiting 状态（阻塞）不会释放锁。<br>
    1: 睡眠时间如果没有传入的话，该线程会一直堵赛
 * 其它线程可以使用 interrupt 方法打断正在睡眠的线程，这时 sleep 方法会抛出 InterruptedException。<br>
    
 * 睡眠结束后的线程未必会立刻得到执行，状态变为就绪状态。<br>
 * 建议用 TimeUnit 的 sleep 代替 Thread 的 sleep 来获得更好的可读性 <br>
 
 ```java 
   public static void main(String[] args) throws InterruptedException {
         long now = System.currentTimeMillis();;
         Thread thread =  new Thread(()->{
            try {
 
                TimeUnit.SECONDS.sleep(2);
 
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
         thread.start();
         TimeUnit.SECONDS.sleep(1);
         long after = System.currentTimeMillis();
         Thread.State state = thread.getState();
         System.out.println("主线程睡眠时间是："+(after-now)+"    thread线程状态："+state);
         thread.join();
         System.out.println("thread线程睡眠时间是："+(System.currentTimeMillis()-now)+"    休息之后的线程状态："+state);
     }
 ```     
 ```text 
主线程睡眠时间是：1050    thread线程状态：TIMED_WAITING
thread线程睡眠时间是：2043    休息之后的线程状态：TIMED_WAITING
```
```java
     public static void main(String[] args)  {
           Thread thread =  new Thread(()->{
               try {
                   TimeUnit.SECONDS.sleep(2);
   
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
           });
           thread.start();
           thread.interrupt();
   
   
       }
```
```text 
java.lang.InterruptedException: sleep interrupted
	at java.lang.Thread.sleep(Native Method)
	at java.lang.Thread.sleep(Thread.java:340)
	at java.util.concurrent.TimeUnit.sleep(TimeUnit.java:386)
	at org.example.api.SleepDemo.lambda$main$0(SleepDemo.java:11)
	at java.lang.Thread.run(Thread.java:748)
```
 * 原理
 1：挂起进程（或线程）并修改其运行状态<br>
 2：用sleep()提供的参数来设置一个定时器<br>
 3：当时间结束，定时器会触发，内核收到中断后修改进程（或线程）的运行状态。例如线程会被标志为就绪而进入就绪队列等待调度<br>
  
####  join
 * 调用 join 会让当前线程等待被调用的线程执行完。当前线程状态是wait 状态，<br>
 * 如果 join方法可以接收等待时间，如果时间过了，就不会等待操作的线程了<br>
 * 一个线程 等待多个线程，最终的等待时间是执行时间最长的线程。
 
 <img src="/static/dist/images/join1.png" width="100%">
 
 ```java
 private static void joinTest() throws InterruptedException {
        Thread t1 = new Thread(() -> {
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            r1 = 10;
        });
        Thread t2 = new Thread(() -> {
           sleep(2);
            r2 = 20;
        });
        long start = System.currentTimeMillis();
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        long end = System.currentTimeMillis();
        log.debug("r1: {} r2: {} cost: {}", r1, r2, end - start);
    }
```
```text 
20:45:43.239 [main] c.TestJoin - r1: 10 r2: 20 cost: 2005
```
 * 原理<br>
```java
 public final synchronized void join(long millis)
    throws InterruptedException {
        long base = System.currentTimeMillis();
        long now = 0;

        if (millis < 0) {
            throw new IllegalArgumentException("timeout value is negative");
        }

        if (millis == 0) {
            while (isAlive()) {
                wait(0);
            }
        } else {
            while (isAlive()) {
                long delay = millis - now;
                if (delay <= 0) {
                    break;
                }
                wait(delay);
                now = System.currentTimeMillis() - base;
            }
        }
```
 ```text
底层使用wait，当线程isAlive()返回false 此时线程不等待了
```
####  interrupt
 * 打断 sleep，wait，join 的线程，会清空打断状态<br>
```jave
   private static void test1() throws InterruptedException {
      Thread t1 = new Thread(()->{
              sleep(1);
           }, "t1");
      t1.start();
      sleep(0.5);
      t1.interrupt();
      log.debug(" 打断状态: {}", t1.isInterrupted());
}
```
 ```text
java.lang.InterruptedException: sleep interrupted
 at java.lang.Thread.sleep(Native Method)
 at java.lang.Thread.sleep(Thread.java:340)
 at java.util.concurrent.TimeUnit.sleep(TimeUnit.java:386)
 at cn.itcast.n2.util.Sleeper.sleep(Sleeper.java:8)
 at cn.itcast.n4.TestInterrupt.lambda$test1$3(TestInterrupt.java:59)
 at java.lang.Thread.run(Thread.java:745)
21:18:10.374 [main] c.TestInterrupt - 打断状态: false
```
 * 打断正常运行的线程, 不会清空打断状态<br>
 ```java
    private static void test2() throws InterruptedException {
        Thread t2 = new Thread(()->{
            while(true) {
                Thread current = Thread.currentThread();
                boolean interrupted = current.isInterrupted();
                if(interrupted) {
                    log.debug(" 打断状态: {}", interrupted);
                    break;
                }
            }
        }, "t2");
        t2.start();
        sleep(0.5);
        t2.interrupt();
    }
 ```
 ```text
20:57:37.964 [t2] c.TestInterrupt - 打断状态: true
 ```
* 打断 park 线程: 如果打断标记已经是 true, 则 park 会失效
```java
    private static void test4() {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                log.debug("park...");
                LockSupport.park();
                log.debug("打断状态：{}", Thread.currentThread().isInterrupted());
            }
        });
        t1.start();
        sleep(1);
        t1.interrupt();
    }
```
 ```text
21:13:48.783 [Thread-0] c.TestInterrupt - park... 
21:13:49.809 [Thread-0] c.TestInterrupt - 打断状态：true 
21:13:49.812 [Thread-0] c.TestInterrupt - park... 
21:13:49.813 [Thread-0] c.TestInterrupt - 打断状态：true 
21:13:49.813 [Thread-0] c.TestInterrupt - park... 
21:13:49.813 [Thread-0] c.TestInterrupt - 打断状态：true 
21:13:49.813 [Thread-0] c.TestInterrupt - park... 
21:13:49.813 [Thread-0] c.TestInterrupt - 打断状态：true 
21:13:49.813 [Thread-0] c.TestInterrupt - park... 
21:13:49.813 [Thread-0] c.TestInterrupt - 打断状态：true
 ```
::: warning 
 可以使用 Thread.interrupted() 清除打断状态
:::
  
### 不推荐的方法
 * 还有一些不推荐使用的方法，这些方法已过时，容易破坏同步代码块，造成线程死锁
 
 |方法名      | static | 功能说明        |
 |  ----     | ----   | ----           |
 |stop()     |        |停止线程运行     |
 |suspend()  | 挂起    |（暂停）线程运行  |
 |resume()   |        |恢复线程运行     |

### 主线程与守护线程
 * 默认情况下，Java 进程需要等待所有线程都运行结束，才会结束。有一种特殊的线程叫做守护线程，只要其它非守
   护线程运行结束了，即使守护线程的代码没有执行完，也会强制结束。
```java
    public static void main(String[] args) {
        log.debug("开始运行...");
        Thread t1 = new Thread(() -> {
            log.debug("开始运行...");
            sleep(2);
            log.debug("运行结束...");
        }, "daemon");
        // 设置该线程为守护线程
        t1.setDaemon(true);
        t1.start();
        sleep(1);
        log.debug("运行结束...");
    }
```   
```text
08:26:38.123 [main] c.TestDaemon - 开始运行... 
08:26:38.213 [daemon] c.TestDaemon - 开始运行... 
08:26:39.215 [main] c.TestDaemon - 运行结束...
```
::: warning 
 * 垃圾回收器线程就是一种守护线程
 *  Tomcat 中的 Acceptor 和 Poller 线程都是守护线程，所以 Tomcat 接收到 shutdown 命令后，不会等
 *  待它们处理完当前请求
:::
###  线程状态
 <img src="/static/dist/images/threadState.png" width="100%">
 
#### NEW
 * 《Thread state for a thread which has not yet started》
  线程刚被创建，但是还没有调用 start() 方法
 
#### RUNNABLE
 * RUNNABLE 当调用了 start() 方法之后，注意，Java API 层面的 RUNNABLE 状态涵盖了 操作系统 层面的
   【可运行状态】、【运行状态】和【阻塞状态】（由于 BIO 导致的线程阻塞，在 Java 里无法区分，仍然认为
   是可运行）
#### BLOCKED
 * 线程等待一个 monitor lock 比如 synchronized
#### WAITING
 *  <ul>
      <li>{@link Object#wait() Object.wait} with no timeout</li>
      <li>{@link #join() Thread.join} with no timeout</li>
      <li>{@link LockSupport#park() LockSupport.park}</li>
    </ul>
   以上不带参数的方法 
#### TIMED_WAITING
 * <ul>
     <li>{@link #sleep Thread.sleep}</li>
     <li>{@link Object#wait(long) Object.wait} with timeout</li>
     <li>{@link #join(long) Thread.join} with timeout</li>
     <li>{@link LockSupport#parkNanos LockSupport.parkNanos}</li>
     <li>{@link LockSupport#parkUntil LockSupport.parkUntil}</li>
   </ul>
   以上带参数的方法 
#### TERMINATED
 *  Thread state for a terminated thread. 当线程代码运行结束。

### 文章总结案例
 <img src="/static/dist/images/threadBaseEg.png" width="100%">
 * controller 
 
```java
@RestController
public class MonitorController {
    public static ArrayBlockingQueue<Info> QUEUE = new ArrayBlockingQueue(30);

    @Autowired
    private MonitorService monitorService;

    @GetMapping("/info")
    public List<Info> info() {
        ArrayList<Info> infos = new ArrayList<>();
        QUEUE.drainTo(infos);
        return infos;
    }

    @GetMapping("/start")
    public void start() {
        monitorService.start();
    }

    @GetMapping("/stop")
    public void stop() {
        monitorService.stop();
    }
}
```
 * service

 ```java
@Service
@Slf4j
public class MonitorService {

    private volatile boolean stop;
    private volatile boolean starting;
    private Thread monitorThread;

    public void start() {
        // 缩小同步范围，提升性能
        synchronized (this) {
            log.info("该监控线程已启动?({})", starting);
            if (starting) {
                return;
            }
            starting = true;
        }

        // 由于之前的 balking 模式，以下代码只可能被一个线程执行，因此无需互斥
        monitorThread = new Thread(() -> {
            while (!stop) {
                report();
                sleep(2);
            }
            // 这里的监控线程只可能启动一个，因此只需要用 volatile 保证 starting 的可见性
            log.info("监控线程已停止...");
            starting = false;
        });

        stop = false;
        log.info("监控线程已启动...");
        monitorThread.start();
    }

    private void report() {
        Info info = new Info();
        info.setTotal(Runtime.getRuntime().totalMemory());
        info.setFree(Runtime.getRuntime().freeMemory());
        info.setMax(Runtime.getRuntime().maxMemory());
        info.setTime(System.currentTimeMillis());
        MonitorController.QUEUE.offer(info);
    }

    private void sleep(long seconds) {
        try {
            TimeUnit.SECONDS.sleep(seconds);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public synchronized void stop() {
        stop = true;
        // 不加打断需要等到下一次 sleep 结束才能退出循环，这里是为了更快结束
        monitorThread.interrupt();
    }
```



 

























