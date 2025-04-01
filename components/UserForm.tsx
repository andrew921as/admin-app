"use client";

import apiClient from "@/api/api";
import { isValidEmail } from "@/utils/validations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function UserForm() {
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState("operator");
  const [plate, setPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validations
    if (!userName || !userLastName) {
      toast.error("Por favor ingrese un nombre y apellido.");
      return;
    }

    // Validate email format
    if (!isValidEmail(userEmail)) {
      toast.error("Correo electrónico inválido.");
      return;
    }

    // Validate password
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    // Validate role
    if (rol === "paramedic" && !plate) {
      toast.error("Por favor ingrese la matricula.");
      return;
    }

    // Create user object
    let user = {};
    if (rol === "paramedic") {
      user = {
        firstName:userName,
        lastName: userLastName,
        email: userEmail,
        password: password,
        ambulanceId: plate,
      };
    }else{
      user = {
        firstName:userName,
        lastName: userLastName,
        email: userEmail,
        password: password,
      };
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creando cuenta...");

    try {
      // Register patient through backend endpoint
      await apiClient.post(`/${rol}/register`, user);

      // Successful registration
      toast.success("¡Cuenta creada con éxito!", { id: loadingToast });

      // Redirect to login page
      router.push("/dashboard/users");
    } catch (error: any) {
      // Handle error responses from the backend
      let errorMessage = "Error al crear la cuenta.";

      if (error.response) {
        // Backend returned an error response
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nombre"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Apellido"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
            required
          />
        </div>
        <div>
          <select
            id="role"
            name="roles"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
            required
          >
            <option value="operator">Operador</option>
            <option value="paramedic">Paramedico</option>
            <option value="healthCenter">Clinica</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div>
          {rol === "ambulance" && (
            <input
              type="text"
              placeholder="Matricula"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
              required
            />
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 text-white bg-customRed rounded-full hover:bg-gustomRed focus:outline-none focus:ring-2 focus:ring-customRed focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Cargando..." : "Crear Usuario"}
      </button>
    </form>
  );
}
