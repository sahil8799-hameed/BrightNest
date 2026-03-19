import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {

    public static void main(String[] args) {
        int port = 8080; // agar 8080 kaam na kare to 9090 try karo

        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            server.createContext("/", (HttpExchange exchange) -> {
                String response = "Welcome BrightNest Academy Server I Love You Asad";
                exchange.sendResponseHeaders(200, response.getBytes().length);

                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            });

            server.setExecutor(null); // default executor
            server.start();

            System.out.println("Server Running at http://localhost:" + port);
        } catch (Exception e) {
            System.out.println("Error starting server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}