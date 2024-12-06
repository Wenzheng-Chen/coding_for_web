- reference
    - https://www.oauth.com/
    - https://aaronparecki.com/oauth-2-simplified/
    - https://medium.com/@tony.infisical/guide-to-implementing-oauth-2-0-with-examples-5869f8df78f3
    
- 工作流程
    - 注册应用:
        - 管理员需要在 OAuth 服务（例如 Google、Facebook 等）上注册应用或网站。
        - 注册时需要提供应用的 redirect URI（回调地址），授权完成后，用户会被重定向到这个地址。
        - 注册成功后，OAuth 服务会为这个应用生成一个 Client ID 和 Client Secret。
            - Client ID：用来标识应用。
            - Client Secret：用于后续的身份验证，需妥善保管。
    - 授权请求:
        - 用户（End-user）访问应用或网站。
        - 应用或网站提供一个按钮，例如“用 Google 登录”或“获取第三方权限”。
        - 用户点击按钮后，应用会将用户导航到 OAuth 服务的授权页面（Authorization Endpoint）。
            - 这个请求会包含一些参数：
                - Client ID：标识哪个应用发起的请求。
                - Redirect URI：授权完成后重定向的地址（必须与注册时一致）。
                - Response Type：通常为 code，表示期望获取授权码（Authorization Code）。
                - Scope：申请的权限范围（例如读取用户邮件）。
                - State（可选）：一个随机值，用于防止 CSRF 攻击。
    - 用户授权:
        - 用户会在 OAuth 服务上看到一个授权页面，显示应用请求的权限范围（Scope）。
        - 用户选择是否授权。如果用户同意授权：
            - OAuth 服务会生成一个 Authorization Code（临时授权码）。
            - 用户会被重定向到应用的 Redirect URI，并在 URL 中附带授权码和（如果提供了）state 值。
    - 验证 State（如果使用了 State 参数）:
        - 应用接收到重定向请求后，会检查返回的 state 值与之前生成的值是否一致。
        - 如果一致，则继续流程；如果不一致，则终止操作，因为可能存在 CSRF 攻击。
    - 交换令牌:
        - 应用的服务器端使用收到的授权码向 OAuth 服务的 Token Endpoint 发送请求，换取访问令牌（Access Token）和刷新令牌（Refresh Token，若适用）。
        - 请求中需要提供：
            - Authorization Code：从重定向中获取
            - Client ID 和 Client Secret：验证应用的身份。
            - Redirect URI：需与注册时一致。
            - Grant Type：通常为 authorization_code
        - 如果验证通过，OAuth 服务会返回：
            - Access Token：用于访问授权资源。
            - Refresh Token（若适用）：用于在 Access Token 过期后获取新的令牌。
    - 访问资源:
        - 应用使用获得的 Access Token 向 OAuth 服务的 API 发起请求，访问用户授权的资源





