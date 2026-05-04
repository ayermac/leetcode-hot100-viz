#!/usr/bin/env python3
"""
批量为 problems.json 添加 Python 和 Java 代码
使用方法: ANTHROPIC_API_KEY=your_key python3 scripts/add_multilang.py
"""

import json
import os
import time
from anthropic import Anthropic

def convert_go_to_python(client: Anthropic, go_code: str) -> str:
    """使用 Claude API 将 Go 代码转换为 Python"""
    prompt = f"""将以下 Go 代码转换为等价的 Python 代码。
要求：
1. 保持算法逻辑完全一致
2. 使用 Pythonic 的写法
3. 保留所有注释
4. 只返回代码，不要解释

Go代码：
```go
{go_code}
```

Python代码："""
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            temperature=0,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"    Error converting to Python: {e}")
        return None

def convert_go_to_java(client: Anthropic, go_code: str) -> str:
    """使用 Claude API 将 Go 代码转换为 Java"""
    prompt = f"""将以下 Go 代码转换为等价的 Java 代码。
要求：
1. 保持算法逻辑完全一致
2. 使用标准的 Java 类结构（包含类声明和方法）
3. 保留所有注释
4. 只返回代码，不要解释

Go代码：
```go
{go_code}
```

Java代码："""
    
    try:
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=4096,
            temperature=0,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"    Error converting to Java: {e}")
        return None

def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("错误：请设置 ANTHROPIC_API_KEY 环境变量")
        print("示例: ANTHROPIC_API_KEY=your_key python3 scripts/add_multilang.py")
        return
    
    client = Anthropic(api_key=api_key)
    
    # 读取 problems.json
    with open("data/problems.json", "r", encoding="utf-8") as f:
        problems = json.load(f)
    
    print(f"总共 {len(problems)} 道题目需要处理\n")
    
    processed = 0
    skipped = 0
    errors = 0
    
    for idx, problem in enumerate(problems):
        problem_id = problem["id"]
        title = problem["title"]
        print(f"[{idx+1}/{len(problems)}] 处理: {problem_id} - {title}")
        
        for solution in problem.get("solutions", []):
            for code_block in solution.get("codeBlocks", []):
                if code_block["language"] != "go":
                    continue
                
                go_code = code_block["code"]
                
                # 检查是否已经有 Python 和 Java
                existing_langs = [cb["language"] for cb in solution.get("codeBlocks", [])]
                
                if "python" in existing_langs and "java" in existing_langs:
                    print(f"  ⏭️  跳过（已有 Python 和 Java）")
                    skipped += 1
                    continue
                
                # 转换 Python
                if "python" not in existing_langs:
                    print(f"  🐍 转换为 Python...")
                    python_code = convert_go_to_python(client, go_code)
                    if python_code:
                        solution["codeBlocks"].append({
                            "language": "python",
                            "code": python_code
                        })
                        print(f"  ✅ Python 完成")
                    else:
                        print(f"  ❌ Python 失败")
                        errors += 1
                    time.sleep(0.5)  # 避免速率限制
                
                # 转换 Java
                if "java" not in existing_langs:
                    print(f"  ☕ 转换为 Java...")
                    java_code = convert_go_to_java(client, go_code)
                    if java_code:
                        solution["codeBlocks"].append({
                            "language": "java",
                            "code": java_code
                        })
                        print(f"  ✅ Java 完成")
                    else:
                        print(f"  ❌ Java 失败")
                        errors += 1
                    time.sleep(0.5)  # 避免速率限制
                
                processed += 1
        
        # 每10题保存一次（防止中断丢失进度）
        if (idx + 1) % 10 == 0:
            print(f"\n💾 保存进度 ({idx+1}/{len(problems)})...")
            with open("data/problems.json", "w", encoding="utf-8") as f:
                json.dump(problems, f, ensure_ascii=False, indent=2)
    
    # 最终保存
    print(f"\n💾 最终保存...")
    with open("data/problems.json", "w", encoding="utf-8") as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ 完成!")
    print(f"   处理: {processed}")
    print(f"   跳过: {skipped}")
    print(f"   错误: {errors}")

if __name__ == "__main__":
    main()
