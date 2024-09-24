import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { UsersRepository } from "../users/users.repository";
import { User } from "../users/Users.entity";
import { CreateUserDto } from "../users/CreateUser.dto";
import { validate } from "class-validator";


describe("authService", () => { 
    let authService: AuthService;
    let mockUsersService: Partial<UsersRepository>; // declaramos la variable para poder usarla luego

    const mockUser: CreateUserDto = {
        name: "Jorge",
        email: "jorgemartinez3@email.com",
        password: "Prueba123!",
        confirmPassword: "Prueba123!",
        address: "Franklin 2344",
        phone: 11546384,
        country: "Argentina",
        city: "Buenos Aires",

    };

    beforeEach(async () => {
        mockUsersService = {
            findEmail: () => Promise.resolve(undefined),
            createUser: (user: User): Promise<Omit<User, "password">> => 
                Promise.resolve({
                    ...user,
                    id: "1234fs-234sd-24csfd-34sdfg",
                }),
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: UsersRepository,
                    useValue: mockUsersService,
                },
            ],
        }).compile();
    
        authService = module.get<AuthService>(AuthService);
    });

    it("Create an instance of AuthService", async () => {
        expect(authService).toBeDefined();
    });

    it("La respuesta de signup() no debe incluir isAdmin", async () => {
        const user = await authService.signup(mockUser);
        expect(user).toBeDefined();
        expect(user).not.toHaveProperty('isAdmin');
    });  


    it("Verifica que password y confirmPassword sean iguales usando el DTO", async () => {
        const errors = await validate(mockUser); 
        console.log(errors); 
        expect(errors.length).toBe(0); 
    });

    it("Debe fallar si password y confirmPassword no coinciden usando el DTO", async () => {
        const invalidUser = new CreateUserDto(); 
        invalidUser.password = 'Prueba123!';
        invalidUser.confirmPassword = 'ClaveDistinta123!'; 
        const errors = await validate(invalidUser); 
        expect(errors.length).toBeGreaterThan(0); 
    });

    // it("Si el email ya existe, debería lanzar una excepción", async () => {
    //     mockUsersService.findEmail = () => 
    //         Promise.resolve({
    //             ...mockUser,
    //             id: "un-id-cualquiera",
    //         });
    //     await expect(authService.signup(mockUser)).rejects.toThrowError("Email ya existe");
    // });
});
