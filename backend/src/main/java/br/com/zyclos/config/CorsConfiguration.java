package br.com.zyclos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    // Libera o front-end web (Vite - React na 5173, outro dev server na 3000) e o mobile (Flutter na 8686),
    // aberto no próprio PC (localhost) ou por outro aparelho da mesma rede local (IP 192.168.x.x, 10.x.x.x
    // ou 172.x.x.x, como em "http://192.168.15.6:5173")

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOriginPatterns(
                        "http://localhost:[5173,3000,8686]",
                        "http://127.0.0.1:[5173,3000,8686]",
                        "http://192.168.*:[5173,3000,8686]",
                        "http://10.*:[5173,3000,8686]",
                        "http://172.*:[5173,3000,8686]")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH", "TRACE", "CONNECT");

    }
}
