- JWT（JSON Web Token） 鉴权是一种无状态、轻量化的认证方式，广泛用于分布式系统和现代Web应用程序
- JWT是一种自包含的认证方式，所有的信息都包含在Token本身中，并通过加密签名保证数据的完整性和可信性。
- JWT工作流程
    - 用户向服务器发送登陆请求，服务器验证成功后生成JWT
        - 构造Header和Payload
        - 使用指定的签名算法和密钥生成签名
    - 客户端将JWT存储在LocalStorage、SessionStorage、httponly的cookie里
    - 客户请求携带JWT，将JWT放在HTTP header中，一般为`Authorization: Bearer <token>`
    - 服务器端验证JWT
        - 服务器端接收到JWT后解码Header和Payload
        - 使用预定义的密钥或者公钥验证签名有效性
        - 检查payload中的声明（过期时间、权限等）
- JWT的优缺点
    - 优点：
        - 无状态的，JWT自身包含了所有的认证信息（用户表示，过期时间、权限等），服务器无需保留会话状态
            - 因此，JWT十分适合分布式系统中，并且降低服务器的负担
        - JWT是一个经过base64编码的字符串，可以通过http header、url参数、cookie等方式传递
        - JWT与语言无关，跨平台支持
        - JWT无需数据库查询，所以具有高效性
    - 缺点：
        - JWT一旦签发，在有限期内，即使用户登出、权限变更或者Token泄漏都可以被使用，所以需要严格风险控制，可以设置Token黑名单是某些Token失效
        - JWT使用base64编码，需要确保payload里不包含敏感信息
        - 包含Header、Payload、Signature，体积更大，会带来额外的贷款开销
        - 复杂的续期机制（refresh token）
- 应用场景
    - 分布式架构和微服务架构
    - 移动和前端应用
    - 短期会话认证
- 不适用场景
    - 需要强制失效控制：如果用户频繁登出、权限变更
    - 敏感信息管理：不适合携带敏感信息
    - 长时间会话管理：需要实现额外的refresh token机制
- Refresh Token相关
    - Refresh Token一种长生命周期的令牌，用于获取新的Access Token，它通常与Access Token配合使用，解决短期Access Token失效后，用户无需重新登录即可访问资源的问题
    - Refresh Token通常会在服务器端存储，与用户会话或者设备绑定
    - Refresh Token机制的原因
        - Access Token每次请求都需要携带，泄漏风险大，所以一般Access Token的生命周期比较短
        - Refresh Token一般仅在Access Token失效时才会携带，泄漏风险小，可以适当提高生命周期
        - 两者配合使用能够达到长期登录但又不至于有很大暴露风险
        - 服务器能够通过储存Refresh Token来实现对用户更加细粒度的管理
            - 通过撤销Refresh Token，强制失效相关的Access Token
            - 通过Refresh Token的存储管理可以实现设备、ip绑定等
    - 工作流程
        - 用户登录，服务器端根据用户信息生成Access Token和Refresh Token
        - 用户后续使用Access Token请求保护资源
        - 当Access Token过期后，客户端使用Refresh Token向服务端请求一个新的Access Token
        - Refresh Token过期或者服务器端撤销后，用户重新登录