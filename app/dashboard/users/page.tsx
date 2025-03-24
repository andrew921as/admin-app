"use client";

import apiClient from "@/api/api";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const loadingToast = toast.loading("Cargando Ambulancias...");
    const fetchAmbulances = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/admin/all");
        setUsers(response.data.users);
        console.log(response.data.users);
        toast.success("Usuarios cargados correctamente.", { id: loadingToast });
      } catch (error) {
        console.error("Error fetching ambulances:", error);
        toast.error("Error al cargar los usuarios.", { id: loadingToast });
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();
  }, [user]);

  const handleDelete = async(userId: string, userRol:string) => {
    const loadingToast = toast.loading('Eliminando Ambulancia...');
    try {
      await apiClient.delete(`/${userRol}/delete/${userId}`);
      toast.success('Usuario eliminado exitosamente.', {id: loadingToast});
      setUsers(users.filter((user) => user.userId !== userId));
    } catch (error) {
      console.error("Error fetching ambulances:", error);
      toast.error('Error al eliminar el usuario.', {id: loadingToast});
    }
  };

  if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-customRed"></div>
			</div>
		);
	}

  return (
    <div className="min-h-screen bg-white p-4 flex">
      <div className="w-1/6 container"></div>
      <div className="mt-20 px-4 flex flex-col items-start ml-10 grow">
        <div className="w-10/12">
          <div className="flex justify-between items-start mb-6 w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Usuarios</h1>
            <div className="w-1/5">
              <Button
                title="Agregar"
                color="green"
                onClick={() => router.push("users/createUser")}
              />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">
                    Nombre completo
                  </th>
                  <th className="text-left py-3 px-4 font-medium">email</th>
                  <th className="text-left py-3 px-4 font-medium">rol</th>
                  <th className="text-left py-3 px-4 font-medium">eliminar</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.userId}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{user.firstName} {user.lastName}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="p-1 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Delete user</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay usuarios para mostrar
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
