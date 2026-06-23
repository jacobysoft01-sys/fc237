import { useUser } from "@clerk/expo";
import { Button, Column, Host, Text as ExpoUIText } from "@expo/ui";
import { api } from "@FC237/backend/convex/_generated/api";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { router } from "expo-router";
import { View, ScrollView, StyleSheet } from "react-native";

import { Container } from "@/components/container";
import { SignOutButton } from "@/components/sign-out-button";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function Home() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;
  const { user } = useUser();
  const healthCheck = useQuery(api.healthCheck.get);
  const privateData = useQuery(api.privateData.get);

  return (
    <Container>
      <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="never">
        <View style={styles.content}>
          <Host style={styles.titleHost}>
            <ExpoUIText
              textStyle={{
                color: theme.text,
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              BETTER T STACK
            </ExpoUIText>
          </Host>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: healthCheck ? "#10b981" : "#f59e0b" },
                ]}
              />
              <View style={styles.statusContent}>
                <Host matchContents={{ vertical: true }}>
                  <Column spacing={4}>
                    <ExpoUIText textStyle={{ color: theme.text, fontSize: 14, fontWeight: "bold" }}>
                      Convex
                    </ExpoUIText>
                    <ExpoUIText
                      textStyle={{ color: theme.text, fontSize: 12 }}
                      style={{ opacity: 0.7 }}
                    >
                      {healthCheck === undefined
                        ? "Checking..."
                        : healthCheck === "OK"
                          ? "Connected to API"
                          : "API Disconnected"}
                    </ExpoUIText>
                  </Column>
                </Host>
              </View>
            </View>
          </View>

          <Authenticated>
            <Host style={styles.authHost} matchContents={{ vertical: true }}>
              <Column spacing={6}>
                <ExpoUIText textStyle={{ color: theme.text, fontSize: 14 }}>
                  {`Hello ${user?.emailAddresses[0].emailAddress ?? ""}`}
                </ExpoUIText>
                <ExpoUIText textStyle={{ color: theme.text, fontSize: 14 }}>
                  {`Private Data: ${privateData?.message ?? ""}`}
                </ExpoUIText>
              </Column>
            </Host>
            <SignOutButton />
          </Authenticated>
          <Unauthenticated>
            <Host style={styles.authActionsHost} matchContents={{ vertical: true }}>
              <Column spacing={8}>
                <Button
                  label="Sign in"
                  variant="outlined"
                  onPress={() => router.push("/(auth)/sign-in")}
                />
                <Button label="Sign up" onPress={() => router.push("/(auth)/sign-up")} />
              </Column>
            </Host>
          </Unauthenticated>
          <AuthLoading>
            <Host matchContents={{ vertical: true }}>
              <ExpoUIText textStyle={{ color: theme.text, fontSize: 14 }}>Loading...</ExpoUIText>
            </Host>
          </AuthLoading>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  titleHost: {
    alignSelf: "stretch",
    height: 34,
    marginBottom: 24,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIndicator: {
    height: 10,
    width: 10,
    borderRadius: 999,
  },
  statusContent: {
    flex: 1,
  },
  userCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  userHeader: {
    marginBottom: 8,
  },
  paymentActions: {
    marginTop: 12,
  },
  authHost: {
    marginBottom: 12,
  },
  authActionsHost: {
    marginTop: 4,
  },
  statusCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  statusCardTitleHost: {
    marginBottom: 8,
  },
});
