#!/usr/bin/env python3
"""
헬리콥터 슈팅 게임용 임시 이미지 생성 스크립트
간단한 도형으로 헬리콥터와 프로펠러 이미지를 만듭니다.
"""

try:
    from PIL import Image, ImageDraw
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("⚠️  PIL(Pillow)가 설치되지 않았습니다.")
    print("   설치 방법: pip install Pillow")
    print("\n   또는 base64 인코딩된 최소 이미지를 사용합니다...")

import base64
import os

def create_with_pil():
    """PIL을 사용하여 이미지 생성"""
    # 헬리콥터 이미지 (64x32)
    heli = Image.new('RGBA', (64, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(heli)

    # 헬리콥터 본체 (진한 회색)
    draw.ellipse([10, 10, 50, 25], fill=(80, 80, 80, 255))

    # 조종석 (밝은 회색)
    draw.ellipse([35, 12, 48, 23], fill=(120, 120, 150, 255))

    # 꼬리 (진한 회색)
    draw.rectangle([8, 15, 15, 20], fill=(80, 80, 80, 255))

    # 랜딩 스키드
    draw.line([20, 26, 20, 28], fill=(60, 60, 60, 255), width=2)
    draw.line([40, 26, 40, 28], fill=(60, 60, 60, 255), width=2)
    draw.line([18, 28, 42, 28], fill=(60, 60, 60, 255), width=2)

    heli.save('public/assets/helicopter.png')
    print("✅ helicopter.png 생성 완료 (64x32)")

    # 프로펠러 이미지 (64x4)
    prop = Image.new('RGBA', (64, 4), (0, 0, 0, 0))
    draw = ImageDraw.Draw(prop)

    # 프로펠러 블레이드 (어두운 회색, 약간 투명)
    draw.rectangle([0, 0, 63, 3], fill=(60, 60, 60, 200))

    prop.save('public/assets/propeller.png')
    print("✅ propeller.png 생성 완료 (64x4)")

def create_minimal():
    """최소한의 1x1 PNG를 base64로 디코딩하여 생성"""
    # 64x32 회색 사각형 (헬리콥터)
    heli_base64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAYAAACinX6EAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8"
        "YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA4SURBVGhD7c0BDQAACAMw+Tc9jQJmsCBJkiRJkiRJkiRJ"
        "kiRJkiRJkiRJkiRJkiRJkiRJkiRJkrQrOQABcCQXi8gAAAAASUVORK5CYII="
    )

    # 64x4 검은 선 (프로펠러)
    prop_base64 = (
        "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAECAYAAAA8BnE9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8"
        "YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAaSURBVEhLYxgFo2AUjIJRMApGwSgYBaNgYAAABQAAAdHz"
        "FNcAAAAASUVORK5CYII="
    )

    with open('public/assets/helicopter.png', 'wb') as f:
        f.write(base64.b64decode(heli_base64))
    print("✅ helicopter.png 생성 완료 (최소 이미지)")

    with open('public/assets/propeller.png', 'wb') as f:
        f.write(base64.b64decode(prop_base64))
    print("✅ propeller.png 생성 완료 (최소 이미지)")

if __name__ == '__main__':
    print("🎨 게임 에셋 이미지 생성 중...\n")

    if PIL_AVAILABLE:
        create_with_pil()
    else:
        create_minimal()

    print("\n✨ 에셋 생성 완료! 이제 'npm run dev'로 게임을 실행하세요.")
