package com.halfmoon.halfmoon.security.domain;

import static jakarta.persistence.CascadeType.ALL;
import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

import com.halfmoon.halfmoon.global.domain.BaseEntity;
import com.halfmoon.halfmoon.user.domain.Record;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "unique_email", columnNames = "email")
})
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    UUID id;

    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String role;

    private String name;

    private String nickName;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private NativeLanguage nativeLanguage;

    @Enumerated(EnumType.STRING)
    private KoreanLevel koreanLevel;

    private boolean enabled;

    @OneToOne(mappedBy = "user", cascade = ALL, fetch = LAZY)
    private Record record;

//    @OneToMany(mappedBy = "user")
//    private List<Pin> myPins = new ArrayList<>();
//
//    @OneToMany(mappedBy = "user")
//    private List<BookMark> bookMarks = new ArrayList<>();

    private User(String email, String password, String role, String name, String nickName, Integer age,
                 NativeLanguage nativeLanguage, KoreanLevel koreanLevel, boolean enabled) {

        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.nickName = nickName;
        this.age = age;
        this.enabled = enabled;
        this.nativeLanguage = nativeLanguage;
        this.koreanLevel = koreanLevel;
    }

    @Builder
    public static User create(String email, String password, String role, String name, String nickName, Integer age,
                              NativeLanguage nativeLanguage, KoreanLevel koreanLevel) {
        return new User(email, password, role, name, nickName, age, nativeLanguage, koreanLevel, true);
    }
}
