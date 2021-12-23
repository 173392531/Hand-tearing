// 第一行代码 package main 定义了包名。你必须在源文件中非注释的第一行指明这个文件属于哪个包，如：package main。
// package main表示一个可独立执行的程序，每个 Go 应用程序都包含一个名为 main 的包。
package main

// 下一行 import "fmt" 告诉 Go 编译器这个程序需要使用 fmt 包（的函数，或其他元素），fmt 包实现了格式化 IO（输入/输出）的函数。
import "fmt"

// 第一行代码 package main 定义了包名。你必须在源文件中非注释的第一行指明这个文件属于哪个包，如：package main。
// package main表示一个可独立执行的程序，每个 Go 应用程序都包含一个名为 main 的包。
func main() {
    fmt.Println("Hello, World!")
}

// package main
// import "fmt"
// func main(){
// 	fmt.Println("shabibibib")
// }