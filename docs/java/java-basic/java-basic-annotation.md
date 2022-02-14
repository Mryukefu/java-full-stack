---
lang: zh-CN
title: 页面的标题
description: 页面的描述
---
[[toc]]
# Java 基础 - 注解机制详解
  ## 注解基础
  * 注解是JDK1.5版本开始引入的一个特性，用于对代码进行说明，可以对包、类、接口、字段、方法参数、局部变量等进行注解。它主要的作用有以下四方面
  1. 生成文档，通过代码里标识的元数据生成javadoc文档(@Documented)
  2. 编译检查，通过代码里标识的元数据让编译器在编译期间进行检查验证(@Override)
  3. 编译时动态处理，编译时通过代码里标识的元数据动态处理，例如动态生成代码
  4. 运行时动态处理，运行时通过代码里标识的元数据动态处理，例如使用反射注入实例
  * Java自带的标准注解，包括@Override、@Deprecated和@SuppressWarnings，
  分别用于标明重写某个方法、标明某个类或方法过时、标明要忽略的警告，用这些注解标明后编译器就会进行检查
  *  元注解，元注解是用于定义注解的注解，包括@Retention、@Target、@Inherited、@Documented，@Retention用于标明注解被保留的阶段，
  @Target用于标明注解使用的范围，@Inherited用于标明注解可继承，@Documented用于标明是否生成javadoc文档
  * 自定义注解，可以根据自己的需求定义注解，并可用元注解对自定义注解进行注解
   ### Java内置注解
   我们从最为常见的Java内置的注解开始说起，先看下下面的代码：
   ```java
   class A{
       public void test() {
           
       }
   }
   
   class B extends A{
   
       /**
           * 重载父类的test方法
           */
       @Override
       public void test() {
       }
   
       /**
           * 被弃用的方法 单词不推荐
           */
       @Deprecated
       public void oldMethod() {
       }
   
       /**
           * 忽略告警
           * 
           * @return
           */
       @SuppressWarnings("rawtypes")
       public List processList() {
           List list = new ArrayList();
           return list;
       }
   }

   ```
 *  Java 1.5开始自带的标准注解，包括@Override、@Deprecated和@SuppressWarnings：
 *  @Override：表示当前的方法定义将覆盖父类中的方法 
 *  @Deprecated：表示代码被弃用，如果使用了被@Deprecated注解的代码则编译器将发出警告 
 *  @SuppressWarnings：表示关闭编译器警告信息<br/>
    我们再具体看下这几个内置注解，同时通过这几个内置注解中的元注解的定义来引出元注解<br/>
 
   
   #### @Override
```java
    @Target(ElementType.METHOD) // 注解可以被用来修饰方法
    @Retention(RetentionPolicy.SOURCE) // 编译后的class文件中便不再存在
    public @interface Override {
    }
```
::: warning
 从它的定义我们可以看到，这个注解可以被用来修饰方法，
 并且它只在编译时有效，在编译后的class文件中便不再存在。
 这个注解的作用我们大家都不陌生，那就是告诉编译器被修饰的方法是重写的父类的中的相同签名的方法，
 编译器会对此做出检查，若发现父类中不存在这个方法或是存在的方法签名不同，则会报错。

:::

 

   #### @Deprecated
```java
    @Documented //  输出文档
    @Retention(RetentionPolicy.RUNTIME) // 能够保留到运行时
    @Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})// 能够修饰构造方法、属性、局部变量、方法、包、参数、类型
    public @interface Deprecated {
    }
```
::: warning
从它的定义我们可以知道，它会被文档化，能够保留到运行时，能够修饰构造方法、属性、局部变量、方法、包、参数、类型。这个注解的作用是告诉编译器被修饰的程序元素已被“废弃”，不再建议用户使用
:::

   #### @SuppressWarnings
```java
   @Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE}) // 它能够修饰的程序元素包括类型、属性、方法、参数、构造器、局部变量
   @Retention(RetentionPolicy.SOURCE) // 编译后的class文件中便不再存在,source 只在源码
   public @interface SuppressWarnings {
       String[] value();
   }

```
::: warning
 它能够修饰的程序元素包括类型、属性、方法、参数、构造器、局部变量，只能存活在源码时，取值为String[]。它的作用是告诉编译器忽略指定的警告信息，
 它可以取的值如下所示：
:::
  <img src="/static/dist/images/java-basic-annitation-1.png" width="100%">

   ### 元注解
   上述内置注解的定义中使用了一些元注解（注解类型进行注解的注解类），
   在JDK 1.5中提供了4个标准的元注解：@Target，@Retention，@Documented，@Inherited, 
   在JDK 1.8中提供了两个元注解 @Repeatable和@Native。 ¶ 元注解 - @Target
   #### @Target
   ::: warning
   Target注解的作用是：描述注解的使用范围（即：被修饰的注解可以用在什么地方） 
   Target注解用来说明那些被它所注解的注解类可修饰的对象范围：
   注解可以用于修饰 packages、types（类、接口、枚举、注解类）、类成员（方法、构造方法、成员变量、枚举值）、方法参数和本地变量（如循环变量、catch参数），
   在定义注解类时使用了@Target 能够更加清晰的知道它能够被用来修饰哪些对象，它的取值范围定义在ElementType 枚举中。
   :::   #### @Retention & @RetentionTarget  
   ```java
 public enum ElementType {
     /** Class, interface (including annotation type), or enum declaration */
       类、接口、枚举类
     TYPE,
 
     /** Field declaration (includes enum constants) */
     FIELD, // 成员变量（包括：枚举常量）
 
     /** Method declaration */
     METHOD, // 成员方法
 
     /** Formal parameter declaration */
     PARAMETER, // 方法参数
 
     /** Constructor declaration */
     CONSTRUCTOR, // 构造方法
 
     /** Local variable declaration */
     LOCAL_VARIABLE, // 局部变量
 
     /** Annotation type declaration */
     ANNOTATION_TYPE,// 注解类
 
     /** Package declaration */
     PACKAGE,// 可用于修饰：包
 
     /**
      * Type parameter declaration
      *
      * @since 1.8
      */
     TYPE_PARAMETER, // 类型参数，JDK 1.8 新增
 
     /**
      * Use of a type
      *
      * @since 1.8
      */
     TYPE_USE  // 使用类型的任何地方，JDK 1.8 新增
 }
  ``` 
   #### @Retention
   :::warning
   Reteniton注解用来限定那些被它所注解的注解类在注解到其他类上以后，可被保留到何时，一共有三种策略，定义在RetentionPolicy枚举中。
   :::
   ```java
    public enum RetentionPolicy {
 
    SOURCE,    // 源文件保留 
    CLASS,    // 编译期保留，默认值
    RUNTIME  // 运行期保留，可通过反射去获取注解信息
    }
   ```
   
   #### @Documented
   :::warning
    Documented注解的作用是：描述在使用 javadoc 工具为类生成帮助文档时是否要保留其注解信息。
   :::
   以下代码在使用Javadoc工具可以生成@TestDocAnnotation注解信息。
   ```java
    @Documented
    @Target({ElementType.TYPE,ElementType.METHOD})
    public @interface TestDocAnnotation {

        public String value() default "default";
    }

    @TestDocAnnotation("myMethodDoc")
    public void testDoc() {

    }

   ```
   #### @Inherited
   :::warning
   Inherited注解的作用：被它修饰的Annotation将具有继承性。如果某个类使用了被@Inherited修饰的Annotation，则其子类将自动具有该注解
   :::
   ```java
   定义@Inherited注解：
   @Inherited
   @Retention(RetentionPolicy.RUNTIME)
   @Target({ElementType.TYPE,ElementType.METHOD})
   public @interface TestInheritedAnnotation {
       String [] values();
       int number();
   }

    @TestInheritedAnnotation(values = {"value"}, number = 10)
    public class Person {
    }

   使用这个注解
    class Student extends Person{
        @Test
        public void test(){
            Class clazz = Student.class;
            Annotation[] annotations = clazz.getAnnotations();
            for (Annotation annotation : annotations) {
                System.out.println(annotation.toString());
            }
        }
    }
   ```
 ```text
输出 xxxxxxx.TestInheritedAnnotation(values=[value], number=10)
```
   #### @Repeatable (Java8) 
   :::warning
   允许在同一申明类型(类，属性，或方法)的多次使用同一个注解
   :::
    
   * java 8之前也有重复使用注解的解决方案，但可读性不是很好，比如下面的代码:
   * 由另一个注解来存储重复注解，在使用时候，用存储注解Authorities来扩展重复注解。
   ```java
    public @interface Authority {
        String role();
    }

    public @interface Authorities {
        Authority[] value();
    }

    public class RepeatAnnotationUseOldVersion {

        @Authorities({@Authority(role="Admin"),@Authority(role="Manager")})
        public void doSomeThing(){
        }
    }

   ```
   * Jdk8重复注解
   ```javas
    @Repeatable(Authorities.class)
    public @interface Authority {
        String role();
    }

    public @interface Authorities {
        Authority[] value();
    }

    public class RepeatAnnotationUseNewVersion {
        @Authority(role="Admin")
        @Authority(role="Manager")
        public void doSomeThing(){ }
    }

```
:::warning
不同的地方是，创建重复注解Authority时，加上@Repeatable,指向存储注解Authorities，在使用时候，直接可以重复使用Authority注解。从上面例子看出，java 8里面做法更适合常规的思维，可读性强一点
:::
   
   #### Native (Java8)
   使用 @Native 注解修饰成员变量，则表示这个变量可以被本地代码引用，常常被代码生成工具使用。对于 @Native 注解不常使用，了解即可
   
   ### 注解与反射接口
   :::warning
   定义注解后，如何获取注解中的内容呢？反射包java.lang.reflect下的AnnotatedElement接口提供这些方法。这里注意：只有注解被定义为RUNTIME后，该注解才能是运行时可见，当class文件被装载时被保存在class文件中的Annotation才会被虚拟机读取。
   :::
   * AnnotatedElement 接口是所有程序元素（Class、Method和Constructor）的父接口，所以程序通过反射获取了某个类的AnnotatedElement对象之后，
   程序就可以调用该对象的方法来访问Annotation信息。我们看下具体的先关接口
   <img src="/static/dist/images/java-basic-annitation-2.png" width="100%">
  
   * 判断该程序元素上是否包含指定类型的注解，存在则返回true，否则返回false。注意：此方法会忽略注解对应的注解容器。
   ```java
    boolean isAnnotationPresent(Class<?extends Annotation> annotationClass)
   ```
   * 判断该程序元素上是否包含指定类型的注解，存在则返回true，否则返回false。注意：此方法会忽略注解对应的注解容器
   ```java
    <T extends Annotation> T getAnnotation(Class<T> annotationClass)
   ```
   * 返回该程序元素上存在的、指定类型的注解，如果该类型注解不存在，则返回null。
   ```java
    boolean isAnnotationPresent(Class<?extends Annotation> annotationClass)
   ```
   * 返回该程序元素上存在的所有注解，若没有注解，返回长度为0的数组。
   ```java
    boolean isAnnotationPresent(Class<?extends Annotation> annotationClass)
   ```
   * 返回直接存在于此元素上的所有注解。与此接口中的其他方法不同，该方法将忽略继承的注释。如果没有注释直接存在于此元素上，则返回null
   ```java
    <T extends Annotation> T[] getDeclaredAnnotationsByType(Class<T> annotationClass)
   ```
   ### 自定义注解 
   :::warning
   几句话总结一下上面的内容，
   1》首先定义元注解，主要表达，用在哪里（类，方法，参数），然后保留的时间(源码，运行时) 是否生成到文档，是否被继承，是否可以重复等等。
   2》根据 程序元素程序元素直接获取该元素下的所有或者指定的注解
   3》获取注解对象后读取里面的信息
   :::
   * 定义自己的注解
   ```java
    package com.pdai.java.annotation;
    
    import java.lang.annotation.ElementType;
    import java.lang.annotation.Retention;
    import java.lang.annotation.RetentionPolicy;
    import java.lang.annotation.Target;
    
    @Target(ElementType.METHOD)
    @Retention(RetentionPolicy.RUNTIME)
    public @interface MyMethodAnnotation {
    
        public String title() default "";
    
        public String description() default "";
    
    }

   ```
   * 使用注解

   ```java
  package com.pdai.java.annotation;
  
  import java.io.FileNotFoundException;
  import java.lang.annotation.Annotation;
  import java.lang.reflect.Method;
  import java.util.ArrayList;
  import java.util.List;
  
  public class TestMethodAnnotation {
  
      @Override
      @MyMethodAnnotation(title = "toStringMethod", description = "override toString method")
      public String toString() {
          return "Override toString method";
      }
  
      @Deprecated
      @MyMethodAnnotation(title = "old static method", description = "deprecated old static method")
      public static void oldMethod() {
          System.out.println("old method, don't use it.");
      }
  
      @SuppressWarnings({"unchecked", "deprecation"})
      @MyMethodAnnotation(title = "test method", description = "suppress warning static method")
      public static void genericsTest() throws FileNotFoundException {
          List l = new ArrayList();
          l.add("abc");
          oldMethod();
      }
  }


   ```
   * 用反射接口获取注解信息
   ```java
   package com.pdai.java.annotation;
   
   import java.io.FileNotFoundException;
   import java.lang.annotation.Annotation;
   import java.lang.reflect.Method;
   import java.util.ArrayList;
   import java.util.List;
   
   public class TestMethodAnnotation {
   
       @Override
       @MyMethodAnnotation(title = "toStringMethod", description = "override toString method")
       public String toString() {
           return "Override toString method";
       }
   
       @Deprecated
       @MyMethodAnnotation(title = "old static method", description = "deprecated old static method")
       public static void oldMethod() {
           System.out.println("old method, don't use it.");
       }
   
       @SuppressWarnings({"unchecked", "deprecation"})
       @MyMethodAnnotation(title = "test method", description = "suppress warning static method")
       public static void genericsTest() throws FileNotFoundException {
           List l = new ArrayList();
           l.add("abc");
           oldMethod();
       }
   }
   ```
   
  ## 深入理解注解     
   ### 实现原理
::: warning
注解@interface 是一个实现了Annotation接口的 接口， 然后在调用getDeclaredAnnotations()方法的时候，返回一个代理$Proxy对象，
这个是使用jdk动态代理创建，
使用Proxy的newProxyInstance方法时候，传入接口 和InvocationHandler的一个实例(也就是 AnotationInvocationHandler ) ，
最后返回一个代理实例。
期间，在创建代理对象之前，解析注解时候 从该注解类的常量池中取出注解的信息，包括之前写到注解中的参数，
然后将这些信息在创建 AnnotationInvocationHandler时候 ，传入进去 作为构造函数的参数。
当调用该代理实例的获取值的方法时，就会调用执行AnotationInvocationHandler里面的逻辑，将之前存入的注解信息 取出来。
:::  
  ## 注解的应用场景
   ### 继承实现到注解实现  
   ### 自定义注解和AO
   * 自定义Log注解
   ```java
@Target({ ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {
    /**
     * 模块 
     */
    public String title() default "";

    /**
     * 功能
     */
    public BusinessType businessType() default BusinessType.OTHER;

    /**
     * 操作人类别
     */
    public OperatorType operatorType() default OperatorType.MANAGE;

    /**
     * 是否保存请求的参数
     */
    public boolean isSaveRequestData() default true;
}

   ``` 
   * 实现日志的切面, 对自定义注解Log作切点进行拦截

   ```java
@Aspect
@Component
public class LogAspect {
    private static final Logger log = LoggerFactory.getLogger(LogAspect.class);

    /**
     * 配置织入点 - 自定义注解的包路径
     * 
     */
    @Pointcut("@annotation(com.xxx.aspectj.lang.annotation.Log)")
    public void logPointCut() {
    }

    /**
     * 处理完请求后执行
     *
     * @param joinPoint 切点
     */
    @AfterReturning(pointcut = "logPointCut()", returning = "jsonResult")
    public void doAfterReturning(JoinPoint joinPoint, Object jsonResult) {
        handleLog(joinPoint, null, jsonResult);
    }

    /**
     * 拦截异常操作
     * 
     * @param joinPoint 切点
     * @param e 异常
     */
    @AfterThrowing(value = "logPointCut()", throwing = "e")
    public void doAfterThrowing(JoinPoint joinPoint, Exception e) {
        handleLog(joinPoint, e, null);
    }

    protected void handleLog(final JoinPoint joinPoint, final Exception e, Object jsonResult) {
        try {
            // 获得注解
            Log controllerLog = getAnnotationLog(joinPoint);
            if (controllerLog == null) {
                return;
            }

            // 获取当前的用户
            User currentUser = ShiroUtils.getSysUser();

            // *========数据库日志=========*//
            OperLog operLog = new OperLog();
            operLog.setStatus(BusinessStatus.SUCCESS.ordinal());
            // 请求的地址
            String ip = ShiroUtils.getIp();
            operLog.setOperIp(ip);
            // 返回参数
            operLog.setJsonResult(JSONObject.toJSONString(jsonResult));

            operLog.setOperUrl(ServletUtils.getRequest().getRequestURI());
            if (currentUser != null) {
                operLog.setOperName(currentUser.getLoginName());
                if (StringUtils.isNotNull(currentUser.getDept())
                        && StringUtils.isNotEmpty(currentUser.getDept().getDeptName())) {
                    operLog.setDeptName(currentUser.getDept().getDeptName());
                }
            }

            if (e != null) {
                operLog.setStatus(BusinessStatus.FAIL.ordinal());
                operLog.setErrorMsg(StringUtils.substring(e.getMessage(), 0, 2000));
            }
            // 设置方法名称
            String className = joinPoint.getTarget().getClass().getName();
            String methodName = joinPoint.getSignature().getName();
            operLog.setMethod(className + "." + methodName + "()");
            // 设置请求方式
            operLog.setRequestMethod(ServletUtils.getRequest().getMethod());
            // 处理设置注解上的参数
            getControllerMethodDescription(controllerLog, operLog);
            // 保存数据库
            AsyncManager.me().execute(AsyncFactory.recordOper(operLog));
        } catch (Exception exp) {
            // 记录本地异常日志
            log.error("==前置通知异常==");
            log.error("异常信息:{}", exp.getMessage());
            exp.printStackTrace();
        }
    }

    /**
     * 获取注解中对方法的描述信息 用于Controller层注解
     * 
     * @param log 日志
     * @param operLog 操作日志
     * @throws Exception
     */
    public void getControllerMethodDescription(Log log, OperLog operLog) throws Exception {
        // 设置action动作
        operLog.setBusinessType(log.businessType().ordinal());
        // 设置标题
        operLog.setTitle(log.title());
        // 设置操作人类别
        operLog.setOperatorType(log.operatorType().ordinal());
        // 是否需要保存request，参数和值
        if (log.isSaveRequestData()) {
            // 获取参数的信息，传入到数据库中。
            setRequestValue(operLog);
        }
    }

    /**
     * 获取请求的参数，放到log中
     * 
     * @param operLog
     * @param request
     */
    private void setRequestValue(OperLog operLog) {
        Map<String, String[]> map = ServletUtils.getRequest().getParameterMap();
        String params = JSONObject.toJSONString(map);
        operLog.setOperParam(StringUtils.substring(params, 0, 2000));
    }

    /**
     * 是否存在注解，如果存在就获取
     */
    private Log getAnnotationLog(JoinPoint joinPoint) throws Exception {
        Signature signature = joinPoint.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        Method method = methodSignature.getMethod();

        if (method != null)
        {
            return method.getAnnotation(Log.class);
        }
        return null;
    }
}

   ``` 
   * 使用@Log注解
   ```java
@Controller
@RequestMapping("/system/dept")
public class DeptController extends BaseController {
    private String prefix = "system/dept";

    @Autowired
    private IDeptService deptService;
    
    /**
     * 新增保存部门
     */
    @Log(title = "部门管理", businessType = BusinessType.INSERT)
    @RequiresPermissions("system:dept:add")
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult addSave(@Validated Dept dept) {
        if (UserConstants.DEPT_NAME_NOT_UNIQUE.equals(deptService.checkDeptNameUnique(dept))) {
            return error("新增部门'" + dept.getDeptName() + "'失败，部门名称已存在");
        }
        return toAjax(deptService.insertDept(dept));
    }

    /**
     * 保存
     */
    @Log(title = "部门管理", businessType = BusinessType.UPDATE)
    @RequiresPermissions("system:dept:edit")
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult editSave(@Validated Dept dept) {
        if (UserConstants.DEPT_NAME_NOT_UNIQUE.equals(deptService.checkDeptNameUnique(dept))) {
            return error("修改部门'" + dept.getDeptName() + "'失败，部门名称已存在");
        } else if(dept.getParentId().equals(dept.getDeptId())) {
            return error("修改部门'" + dept.getDeptName() + "'失败，上级部门不能是自己");
        }
        return toAjax(deptService.updateDept(dept));
    }

    /**
     * 删除
     */
    @Log(title = "部门管理", businessType = BusinessType.DELETE)
    @RequiresPermissions("system:dept:remove")
    @GetMapping("/remove/{deptId}")
    @ResponseBody
    public AjaxResult remove(@PathVariable("deptId") Long deptId) {
        if (deptService.selectDeptCount(deptId) > 0) {
            return AjaxResult.warn("存在下级部门,不允许删除");
        }
        if (deptService.checkDeptExistUser(deptId)) {
            return AjaxResult.warn("部门存在用户,不允许删除");
        }
        return toAjax(deptService.deleteDeptById(deptId));
    }

  // ...
}

   ``` 
   


 
       
 





