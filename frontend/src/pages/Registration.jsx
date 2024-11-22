import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import MyButton from "../components/UI/button/MyButton";
import MyInput from "../components/UI/input/MyInput";

const Registration = () => {
    const { register, formState: { errors, isValid }, handleSubmit, reset, watch } = useForm({
        mode: "onBlur",
    });

    const onSubmit = (data) => {
        data.age = Number(data.age);
        console.log(data);
        try {
            axios.post('http://localhost:8080/registration', data);
            reset();
        } catch (e) {
            console.log(e);
        }
    };

    // Получаем значение пароля для проверки на совпадение
    const password = watch("password");

    return (
        <div>
            <h1>Регистрация</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Email
                    <MyInput
                        {...register('email', {
                            required: "Поле обязательно к заполнению",
                            pattern: {
                                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                message: "Некорректный email"
                            }
                        })}
                        label="E-mail"
                        type="email"
                        placeholder="Введите E-mail"
                        id="email"
                        name="email"
                        autoComplete="email"
                    />
                </label>
                <div style={{ height: 40 }}>
                    {errors?.email && <p style={{ color: "green" }}>{errors?.email?.message || "Ошибка!"}</p>}
                </div>

                <label>
                    Пароль
                    <MyInput
                        {...register('password', {
                            required: "Поле обязательно к заполнению",
                            minLength: {
                                value: 8,
                                message: "Слишком короткий пароль"
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/,
                                message: "Пароль должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру"
                            }
                        })}
                        label="Пароль"
                        type="password"
                        placeholder="Введите пароль"
                        id="password"
                        name="password"
                        autoComplete="new-password"  // Атрибут autocomplete для пароля
                    />
                </label>
                <div style={{ height: 40 }}>
                    {errors?.password && <p style={{ color: "green" }}>{errors?.password?.message || "Ошибка!"}</p>}
                </div>

                <label>
                    Подтверждение пароля
                    <MyInput
                        {...register('confirmPassword', {
                            required: "Поле обязательно к заполнению",
                            validate: value => value === password || "Пароли не совпадают"
                        })}
                        label="Подтверждение пароля"
                        type="password"
                        placeholder="Подтвердите пароль"
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="current-password"  // Атрибут autocomplete для пароля
                    />
                </label>
                <div style={{ height: 40 }}>
                    {errors?.confirmPassword && <p style={{ color: "green" }}>{errors?.confirmPassword?.message || "Ошибка!"}</p>}
                </div>

                <label>
                    Возраст
                    <MyInput
                        {...register('age', {
                            required: "Поле обязательно к заполнению",
                            min: { value: 18, message: "Слишком мало" },
                            max: { value: 130, message: "Слишком много" }
                        })}
                        label="Возраст"
                        type="number"
                        placeholder="Введите возраст"
                        id="age"
                        name="age"
                    />
                </label>
                <div style={{ height: 40 }}>
                    {errors?.age && <p style={{ color: "green" }}>{errors?.age?.message || "Ошибка!"}</p>}
                </div>

                <label>
                    Имя
                    <MyInput
                        {...register('name', {
                            required: "Поле обязательно к заполнению",
                            minLength: { value: 1, message: "Имя не может быть пустым" },
                            maxLength: { value: 255, message: "Слишком длинное имя" }
                        })}
                        label="Имя"
                        type="text"
                        placeholder="Введите имя"
                        id="name"
                        name="name"
                    />
                </label>
                <div style={{ height: 40 }}>
                    {errors?.name && <p style={{ color: "green" }}>{errors?.name?.message || "Ошибка!"}</p>}
                </div>

                <label>
                    Фамилия
                    <MyInput
                        {...register('surname', {
                            required: "Поле обязательно к заполнению",
                            minLength: { value: 1, message: "Фамилия не может быть пустой" },
                            maxLength: { value: 255, message: "Слишком длинная фамилия" }
                        })}
                        label="Фамилия"
                        type="text"
                        placeholder="Введите фамилию"
                        id="surname"
                        name="surname"
                    />
                </label>
                <div style={{ height: 40 }}>
                    {errors?.surname && <p style={{ color: "green" }}>{errors?.surname?.message || "Ошибка!"}</p>}
                </div>

                <MyButton className="green" disabled={!isValid}>Зарегистрироваться</MyButton>
            </form>
        </div>
    );
};

export default Registration;