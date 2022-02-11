---
lang: zh-CN
title: 页面的标题
description: 页面的描述
---

[[toc]]

# 同步
 * 问题点 计算机是多核多线程，所以就会出现多个线程访问同一个资源问题。线程贡献的变量就会变得不安全(被其他线程修改，并不是原始值)<br>
  解决问题的方案 一般有两种
 1. 共享资源临界区加锁，这种访问资源是阻塞的（synchronized,lock） 
 2. 每个线程备份一份资源，只有当访问的时候，对比改变，这种访问资源是非阻塞的，但是因为牵扯到CPU轮询。CPU 资源消耗严重(原子变量) 
 
### 同步锁 synchronized
 * 作用：可对一个对象进行加锁，一般来讲作用于方法上面，可作用于普通方法，静态方法，也可以直接修饰对象，synchronized 修改的代码块内有且只有一个线程在执行。
 * synchronized  作用在方法上面代表对当前调用方法的对方进行加锁，作用在静态方法上面表示是对对当前对象的类对象进行加锁，字节码默认标识：
 flags: ACC_PUBLIC, ACC_STATIC 
 
 原理流程：<br/>
 1.synchronized 修改的代码块加锁经历了 无锁，偏向锁 轻量级锁，重量级锁，所对象头信息64位虚拟机分别对应的如下标识
 <table>
 <thead>
 <th colspan="5">Mark Word (64 bits)</th>
 <th>标识</th>
 <th>State</th>
 </thead>
<tbody>
 <tr>
  <td>unused:25</td>
  <td>hashcode:31</td>
  <td>unused:1</td>
  <td>age:4</td>
  <td>biased_lock:0 </td>
  <td>01</td>
  <td>Normal</td>
 </tr>
 <tr>
   <td>thread:54</td>
   <td>epoch:2</td>
   <td>unused:1</td>
   <td>age:4</td>
   <td>biased_lock:1 </td>
   <td>01</td>
   <td>Biased</td>
  </tr>
 <tr>
    <td colspan="5">ptr_to_lock_record:62</td>
    <td>00</td>
    <td>Lightweight Locked</td>
   </tr>
 <tr>
      <td colspan="5">ptr_to_lock_record:62</td>
      <td>11</td>
      <td>Marked for GC</td>
     </tr>
</tbody>
 </table>
 
 

 
 
 



 
 
 
     
  

 

























