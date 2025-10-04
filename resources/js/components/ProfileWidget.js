import React from "react";

export default function ProfileWidget({ profile }) {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "transparent",
            padding: "0 18px"
        }}>
            <div style={{
                background: "#a855f7",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#fff",
                fontSize: "18px",
                overflow: "hidden"
            }}>
                {profile.profileImage ? (
                    <img
                        src={profile.profileImage}
                        alt="Profile"
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    profile.name.split(' ').map(n => n[0]).join('')
                )}
            </div>
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: "15px" }}>
                {profile.name}
            </span>
        </div>
    );
}