#!/usr/bin/env python3
"""
手动批量转换Go代码为Python和Java
使用规则引擎进行代码转换，无需API Key
"""

import json
import re
from pathlib import Path

def convert_go_to_python(go_code: str) -> str:
    """基于规则将Go代码转换为Python"""
    python_code = go_code

    # 1. 函数定义转换
    # func name(params) returnType { -> def name(params):
    func_pattern = r'func\s+(\w+)\(([^)]*)\)\s*(\w*)\s*\{'
    def convert_func(match):
        name = match.group(1)
        params = match.group(2).strip()
        ret_type = match.group(3).strip()

        # 转换参数
        py_params = []
        if params:
            for param in params.split(','):
                param = param.strip()
                if ' ' in param:
                    # 有类型声明
                    parts = param.rsplit(' ', 1)
                    py_params.append(parts[0])
                else:
                    py_params.append(param)

        return f"def {name}({', '.join(py_params)}):"

    python_code = re.sub(func_pattern, convert_func, python_code)

    # 2. 变量声明转换
    # var name type = value -> name = value
    # name := value -> name = value
    python_code = re.sub(r'var\s+(\w+)\s+\w+\s*=\s*', r'\1 = ', python_code)
    python_code = re.sub(r'(\w+)\s*:=\s*', r'\1 = ', python_code)

    # 3. 类型转换
    # make([]int, len) -> [0] * len
    python_code = re.sub(r'make\(\[\]int,\s*(\w+)\)', r'[0] * \1', python_code)
    python_code = re.sub(r'make\(\[\]bool,\s*(\w+)\)', r'[False] * \1', python_code)

    # 4. 数组/切片操作
    # append(slice, item) -> slice.append(item)
    python_code = re.sub(r'(\w+)\s*=\s*append\((\w+),\s*([^)]+)\)',
                         r'\2.append(\3)', python_code)

    # 5. 控制流转换
    # for i := 0; i < n; i++ { -> for i in range(n):
    python_code = re.sub(r'for\s+(\w+)\s*:=\s*0;\s*\1\s*<\s*(\w+);\s*\w+\+\+\s*\{',
                         r'for \1 in range(\2):', python_code)
    # for i := start; i < len(arr); i++ { -> for i in range(start, len(arr)):
    python_code = re.sub(r'for\s+(\w+)\s*:=\s*(\w+);\s*\1\s*<\s*len\((\w+)\);\s*\w+\+\+\s*\{',
                         r'for \1 in range(\2, len(\3)):', python_code)
    # for i < n { -> while i < n:
    python_code = re.sub(r'for\s+([^;{]+)\{', r'while \1:', python_code)
    # for _, item := range items { -> for item in items:
    python_code = re.sub(r'for\s+_,?\s*(\w+)\s*:=\s*range\s+(\w+)\s*\{',
                         r'for \1 in \2:', python_code)
    # for i := range items { -> for i in range(len(items)):
    python_code = re.sub(r'for\s+(\w+)\s*:=\s*range\s+(\w+)\s*\{',
                         r'for \1 in range(len(\2)):', python_code)

    # 6. 条件语句
    # if condition { -> if condition:
    python_code = re.sub(r'if\s+([^;{]+)\{', r'if \1:', python_code)
    # } else { -> else:
    python_code = re.sub(r'\}\s*else\s*\{', r'else:', python_code)
    # } else if { -> elif:
    python_code = re.sub(r'\}\s*else\s+if\s+([^;{]+)\{', r'elif \1:', python_code)

    # 7. 布尔值
    python_code = python_code.replace('true', 'True').replace('false', 'False')
    python_code = python_code.replace('nil', 'None')

    # 8. 删除多余的分号和大括号
    python_code = re.sub(r';', '', python_code)
    python_code = re.sub(r'\}', '', python_code)

    # 9. 数组复制
    # copy(dst, src) -> dst[:] = src[:]
    python_code = re.sub(r'copy\((\w+),\s*(\w+)\)',
                         r'\1[:] = \2[:]', python_code)

    return python_code.strip()


def convert_go_to_java(go_code: str) -> str:
    """基于规则将Go代码转换为Java"""
    java_code = go_code

    # 1. 函数定义转换
    func_pattern = r'func\s+(\w+)\(([^)]*)\)\s*(\w*)\s*\{'
    def convert_func_java(match):
        name = match.group(1)
        params = match.group(2).strip()
        ret_type = match.group(3).strip()

        # 转换参数
        java_params = []
        if params:
            for param in params.split(','):
                param = param.strip()
                if ' ' in param:
                    parts = param.rsplit(' ', 1)
                    var_name = parts[0]
                    var_type = parts[1]
                    java_type = 'int' if var_type == 'int' else 'int[]' if '[]' in var_type else 'boolean'
                    java_params.append(f"{java_type} {var_name}")
                else:
                    java_params.append(f"int {param}")

        ret = 'int' if ret_type == 'int' else 'void'
        return f"public {ret} {name}({', '.join(java_params)}) {{"

    java_code = re.sub(func_pattern, convert_func_java, java_code)

    # 2. 变量声明转换
    java_code = re.sub(r'var\s+(\w+)\s+(\w+)\s*=\s*', r'\2 \1 = ', java_code)
    java_code = re.sub(r'(\w+)\s*:=\s*(\d+)', r'int \1 = \2', java_code)
    java_code = re.sub(r'(\w+)\s*:=\s*\[\]', r'List<Integer> \1 = new ArrayList<>()', java_code)

    # 3. 控制流
    java_code = re.sub(r'for\s+(\w+)\s*:=\s*0;\s*\1\s*<\s*(\w+);\s*\w+\+\+\s*\{',
                       r'for (int \1 = 0; \1 < \2; \1++) {', java_code)
    java_code = re.sub(r'for\s+(\w+)\s*:=\s*(\w+);\s*\1\s*<\s*len\((\w+)\);\s*\w+\+\+\s*\{',
                       r'for (int \1 = \2; \1 < \3.length; \1++) {', java_code)
    java_code = re.sub(r'for\s+_,?\s*(\w+)\s*:=\s*range\s+(\w+)\s*\{',
                       r'for (int \1 : \2) {', java_code)

    # 4. len()转换
    java_code = re.sub(r'len\((\w+)\)', r'\1.length', java_code)

    # 5. 布尔值
    java_code = java_code.replace('nil', 'null')

    # 6. copy转换
    java_code = re.sub(r'copy\((\w+),\s*(\w+)\)',
                       r'System.arraycopy(\2, 0, \1, 0, \2.length)', java_code)

    return java_code.strip()


def process_problems():
    """处理所有题目"""
    data_path = Path('data/problems.json')

    with open(data_path, 'r', encoding='utf-8') as f:
        problems = json.load(f)

    print(f"处理 {len(problems)} 道题目...")
    converted = 0
    skipped = 0
    errors = 0

    for problem in problems:
        problem_id = problem['id']

        for solution in problem['solutions']:
            code_blocks = solution['codeBlocks']

            # 检查是否已有Python和Java
            has_python = any(cb['language'] == 'python' for cb in code_blocks)
            has_java = any(cb['language'] == 'java' for cb in code_blocks)

            if has_python and has_java:
                skipped += 1
                continue

            # 找到Go代码
            go_block = next((cb for cb in code_blocks if cb['language'] == 'go'), None)
            if not go_block:
                continue

            go_code = go_block['code']

            try:
                if not has_python:
                    python_code = convert_go_to_python(go_code)
                    code_blocks.append({
                        'language': 'python',
                        'code': python_code
                    })

                if not has_java:
                    java_code = convert_go_to_java(go_code)
                    code_blocks.append({
                        'language': 'java',
                        'code': java_code
                    })

                converted += 1
                print(f"✓ 题目 {problem_id}: {problem['title'][:30]}... 转换完成")

            except Exception as e:
                errors += 1
                print(f"✗ 题目 {problem_id}: 转换失败 - {e}")

    # 保存结果
    backup_path = Path('data/problems_backup.json')
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)
    print(f"\n备份已保存: {backup_path}")

    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(problems, f, ensure_ascii=False, indent=2)
    print(f"数据已更新: {data_path}")

    print(f"\n统计:")
    print(f"  转换成功: {converted}")
    print(f"  跳过(已有): {skipped}")
    print(f"  错误: {errors}")


if __name__ == '__main__':
    process_problems()
